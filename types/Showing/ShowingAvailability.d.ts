declare interface IShowingAvailability
  extends IShowingAvailabilityInput,
    IModel<'showing_availability'> {
  showing: UUID
}
