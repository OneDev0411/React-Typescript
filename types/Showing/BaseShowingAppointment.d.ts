declare interface IBaseShowingAppointment {
  source: IShowingSource
  time: string
  buyer_message: Nullable<string>
  status: IShowingAppointmentStatus
}
