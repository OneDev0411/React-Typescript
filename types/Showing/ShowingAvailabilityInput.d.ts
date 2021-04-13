declare interface IShowingAvailabilityInput {
  id: UUID
  weekday: IDayOfWeek
  // A half-closed range [lower, upper)
  availability: [number, number]
}
