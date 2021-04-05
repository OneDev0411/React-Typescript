declare interface IShowingAvailability extends IModel<'showing_availability'> {
  showing: UUID
  weekday: DayOfWeek
  // A half-closed range [lower, upper)
  availability: [number, number]
}
