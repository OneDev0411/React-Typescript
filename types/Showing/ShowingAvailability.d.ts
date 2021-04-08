declare interface IShowingAvailabilitySlot {
  id: UUID
  weekday: IDayOfWeek
  // A half-closed range [lower, upper)
  availability: [number, number]
}

declare interface IShowingAvailability
  extends IShowingAvailabilitySlot,
    IModel<'showing_availability'> {
  showing: UUID
}
