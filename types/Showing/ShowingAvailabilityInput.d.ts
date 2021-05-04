declare interface IShowingAvailabilityInput {
  id: UUID
  weekday: Weekday
  // A half-closed range [lower, upper)
  availability: [number, number]
}
