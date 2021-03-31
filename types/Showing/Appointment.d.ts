declare interface IAppointment extends IModel<'appointment'> {
  source: string
  time: string
  status: IAppointmentStatus
  contact: IContact
}
