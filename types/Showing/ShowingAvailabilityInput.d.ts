declare interface IShowingAvailabilityInput {
  weekday: IDayOfWeek
  // A half-closed range [lower, upper)
  availability: [number, number]
}
