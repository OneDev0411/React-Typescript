import { editBrandFlowStep } from 'models/flows/edit-brand-flow-step'

import { convertStepToStepInput } from '../helpers'

export const ONE_DAY_IN_SECONDS = 86400
export const ONE_HOUR_IN_SECONDS = 3600
export const ONE_MINUTE_IN_SECONDS = 60

// Returns number of another bases and remaining seconds
function secondsToAnotherBase(seconds: number, base: number): [number, number] {
  const anotherBase = Math.floor(seconds / base)
  const remainingSeconds = seconds % base

  return [anotherBase, remainingSeconds]
}

// Returns number of days and remaining seconds
export function secondsToDays(seconds: number): [number, number] {
  return secondsToAnotherBase(seconds, ONE_DAY_IN_SECONDS)
}

// Returns number of hours and remaining seconds
function secondsToHours(seconds: number): [number, number] {
  return secondsToAnotherBase(seconds, ONE_HOUR_IN_SECONDS)
}

// Returns number of minutes and remaining seconds
function secondsToMinutes(seconds: number): [number, number] {
  return secondsToAnotherBase(seconds, ONE_MINUTE_IN_SECONDS)
}

interface HumanizedTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Returns humanized object of seconds
export function humanizeSeconds(seconds: number): HumanizedTime {
  const [days, remainingSecondsFromDays] = secondsToDays(seconds)
  const [hours, remainingSecondsFromHours] = secondsToHours(
    remainingSecondsFromDays
  )
  const [minutes, remainingSecondsFromMinutes] = secondsToMinutes(
    remainingSecondsFromHours
  )

  return {
    days,
    hours,
    minutes,
    seconds: remainingSecondsFromMinutes
  }
}

export function formatTimeDigits(digits: number): string {
  if (digits > 9) {
    return digits.toString()
  }

  return `0${digits}`
}

export function timeToSeconds(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * ONE_HOUR_IN_SECONDS + minutes * ONE_MINUTE_IN_SECONDS
}

export function getNextStepStartFrom(step?: IBrandFlowStep): number {
  if (!step) {
    return 0
  }

  const seconds = step.due_in
  const [days] = secondsToDays(seconds)

  return days * ONE_DAY_IN_SECONDS
}

export function shouldUpdateNextSteps(
  flow: IBrandFlow,
  updatedStepId: UUID,
  updatedStepData: IBrandFlowStep | IBrandFlowStepInput,
  stepDeleted: boolean = false
): [boolean, number, IBrandFlowStep[]] {
  // If flow has no other steps or it doesn't have any as the steps are optional
  if (!flow.steps || flow.steps.length <= 1) {
    return [false, 0, []]
  }

  const updatedStepIndex = flow.steps.findIndex(
    step => step.id === updatedStepId
  )

  // If no step found or it's the last step
  if (updatedStepIndex === -1 || updatedStepIndex === flow.steps.length - 1) {
    return [false, 0, []]
  }

  const oldStepData = flow.steps[updatedStepIndex]
  const stepDueDiff = stepDeleted
    ? Math.floor(updatedStepData.due_in / ONE_DAY_IN_SECONDS) *
      ONE_DAY_IN_SECONDS *
      -1
    : updatedStepData.due_in - oldStepData.due_in

  // If flow wait days is not changed
  if (Math.abs(stepDueDiff) < ONE_DAY_IN_SECONDS) {
    return [false, 0, []]
  }

  return [
    true,
    Math.floor(stepDueDiff / ONE_DAY_IN_SECONDS) * ONE_DAY_IN_SECONDS,
    flow.steps.slice(updatedStepIndex + 1)
  ]
}

export async function updateStepsDue(
  brand: UUID,
  flowId: UUID,
  steps: IBrandFlowStep[],
  dueDiff: number
): Promise<any> {
  return steps.map(step => {
    const newStep = convertStepToStepInput(step)

    newStep.due_in += dueDiff

    return editBrandFlowStep(brand, flowId, step.id, newStep)
  })
}

export function getMovingStepDue(
  steps: IBrandFlowStep[],
  sourceStepIndex: number,
  targetStepIndex: number
): number {
  const [neededWaitDays] = secondsToDays(
    steps[sourceStepIndex].due_in -
      (sourceStepIndex > 0 ? steps[sourceStepIndex - 1].due_in : 0)
  )
  const [, neededSeconds] = secondsToDays(steps[sourceStepIndex].due_in)

  const [targetWaitDays] = secondsToDays(
    targetStepIndex > 0 ? steps[targetStepIndex - 1].due_in : 0
  )

  return (
    targetWaitDays * ONE_DAY_IN_SECONDS +
    neededWaitDays * ONE_DAY_IN_SECONDS +
    neededSeconds
  )
}

function getStepWaitDays(step: IBrandFlowStep, prevStep?: IBrandFlowStep) {
  if (!prevStep) {
    return secondsToDays(step.due_in)[0]
  }

  return secondsToDays(step.due_in - prevStep.due_in)[0]
}

export async function moveStep(
  brand: UUID,
  flow: IBrandFlow,
  sourceStepIndex: number,
  targetStepIndex: number
): Promise<any> {
  // If there are no steps in Flow (which is odd but it's optional in Flow)
  // or the steps count are less than 1 or it's the same which doesn't make any sense to move
  if (
    !flow.steps ||
    flow.steps.length <= 1 ||
    sourceStepIndex === targetStepIndex
  ) {
    return Promise.resolve()
  }

  const movingStepDue = getMovingStepDue(
    flow.steps,
    sourceStepIndex,
    targetStepIndex
  )

  const relativeWaitDays = getStepWaitDays(
    flow.steps[sourceStepIndex],
    sourceStepIndex > 0 ? flow.steps[sourceStepIndex - 1] : undefined
  )

  // Drag down
  const stepsToRemoveDue =
    sourceStepIndex < targetStepIndex
      ? flow.steps.slice(sourceStepIndex + 1, targetStepIndex + 1)
      : []

  // Drag up
  const stepsToAddDue =
    sourceStepIndex > targetStepIndex
      ? flow.steps.slice(targetStepIndex, sourceStepIndex)
      : []

  await updateStepsDue(
    brand,
    flow.id,
    stepsToRemoveDue,
    -1 * relativeWaitDays * ONE_DAY_IN_SECONDS
  )
  await updateStepsDue(
    brand,
    flow.id,
    stepsToAddDue,
    relativeWaitDays * ONE_DAY_IN_SECONDS
  )

  return editBrandFlowStep(brand, flow.id, flow.steps![sourceStepIndex].id, {
    ...convertStepToStepInput(flow.steps![sourceStepIndex]),
    due_in: movingStepDue
  })
}
