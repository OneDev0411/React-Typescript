declare type IShowingAppointmentAssociations = 'showing'

declare interface IShowingAppointment<
  A extends IShowingAppointmentAssociations = ''
> extends IModel<'showing_appointment'>,
    IBaseShowingAppointment {
  showing: A extends 'showing' ? IShowing : UUID
  contact: IContact
  approvals: Nullable<IShowingApproval<'role'>[]>
  notifications: Nullable<INotification[]>
  feedback: Nullable<IShowingAppointmentFeedbackInput>
}
