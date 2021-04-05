declare interface IShowingAppointment extends IModel<'showing_appointment'> {
  // A simple string for now. later we wanna capture the lead source with this
  source: string
  time: string
  status: IAppointmentStatus
  showing: UUID
  contact: IContact
  approvals?: IShowingApproval[]
}
