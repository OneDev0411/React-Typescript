declare interface IShowingAvailabilityInput {
  weekday: Weekday
  // A half-closed range [lower, upper)
  availability: [number, number]
}
