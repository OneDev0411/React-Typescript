// const ONE_DAY_IN_SECONDS = 86400

// export function getStepsWithWaitDays(
//   steps: IBrandFlowStep[]
// ): IBrandFlowStep[] {
//   return steps.map((step, index) => {
//     const prevStepDueInDays =
//       index === 0 ? 0 : Math.floor(steps[index - 1].due_in / ONE_DAY_IN_SECONDS)

//     step.wait_days =
//       Math.floor(step.due_in / ONE_DAY_IN_SECONDS) - prevStepDueInDays

//     return step
//   })
// }
export function getStepsWithWaitDays() {
  return 'tmp value'
}
