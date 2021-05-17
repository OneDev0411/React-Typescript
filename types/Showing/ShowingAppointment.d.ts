declare interface IShowingAppointment
  extends IModel<'showing_appointment'>,
    IBaseShowingAppointment {
  showing: UUID | IShowing // TODO: make association like IPublicShowingAppointment
  contact: IContact
  approvals: Nullable<IShowingApproval[]>
  notifications: Nullable<INotification[]>
  buyer_message: Nullable<string>
}
