import { editBrandFlowSteps } from 'models/flows/edit-brand-flow-steps'

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

export function updateStepsDue(
  brand: UUID,
  flowId: UUID,
  steps: IBrandFlowStep[],
  dueDiff: number
): Promise<any> {
  const stepsData: (IBrandFlowStepInput & { id: UUID })[] = steps.map(step => {
    return {
      ...convertStepToStepInput(step),
      id: step.id,
      due_in: step.due_in + dueDiff
    }
  })

  return editBrandFlowSteps(brand, flowId, stepsData)
}

export function getUpdatedStepsOnMove(
  steps: IBrandFlowStep[],
  source: number,
  destination: number
): [UUID, IBrandFlowStepInput][] {
  // No need to update anything
  if (source === destination) {
    return []
  }

  const result: [UUID, IBrandFlowStepInput][] = []

  const waitDiffInSeconds =
    source === 0
      ? secondsToDays(steps[source].due_in)[0] * ONE_DAY_IN_SECONDS
      : (secondsToDays(steps[source].due_in)[0] -
          secondsToDays(steps[source - 1].due_in)[0]) *
        ONE_DAY_IN_SECONDS

  // Move down
  // Example: from 1 (source) to 3 (destination)
  if (source < destination) {
    result.push(
      ...steps.slice(source + 1, destination + 1).map(step => {
        return [
          step.id,
          {
            ...convertStepToStepInput(step),
            due_in: step.due_in + waitDiffInSeconds * -1
          }
        ] as [UUID, IBrandFlowStepInput]
      })
    )

    const neededWaitDays = secondsToDays(steps[source].due_in)[0]

    const neededSeconds = secondsToDays(steps[source].due_in)[1]

    const destinationWaitDays =
      secondsToDays(steps[destination].due_in)[0] -
      secondsToDays(steps[source].due_in)[0]

    result.push([
      steps[source].id,
      {
        ...convertStepToStepInput(steps[source]),
        due_in:
          destinationWaitDays * ONE_DAY_IN_SECONDS +
          neededWaitDays * ONE_DAY_IN_SECONDS +
          neededSeconds
      }
    ])
  }

  // Move up
  // Example: from 3 (source) to 1 (destination)
  if (source > destination) {
    result.push(
      ...steps.slice(destination, source).map(step => {
        return [
          step.id,
          {
            ...convertStepToStepInput(step),
            due_in: step.due_in + waitDiffInSeconds
          }
        ] as [UUID, IBrandFlowStepInput]
      })
    )

    const neededWaitDays =
      secondsToDays(steps[source].due_in)[0] -
      secondsToDays(steps[source - 1].due_in)[0]

    const neededSeconds = secondsToDays(steps[source].due_in)[1]

    const destinationWaitDays = secondsToDays(
      destination > 0 ? steps[destination - 1].due_in : 0
    )[0]

    result.push([
      steps[source].id,
      {
        ...convertStepToStepInput(steps[source]),
        due_in:
          destinationWaitDays * ONE_DAY_IN_SECONDS +
          neededWaitDays * ONE_DAY_IN_SECONDS +
          neededSeconds
      }
    ])
  }

  return result
}
