declare interface IShowingRole extends IModel<'showing_role'> {
  showing: UUID
  created_by: number
  role: IShowingRoleType
  first_name: string
  last_name: string
  email: string
  phone_number: string
  // TODO: the user of IShowingRoleInput is optional so this must be optional too. Am I wrong?
  user: Optional<IUser> // Probably wrong, comes with association as an IUser
  agent: Optional<IShowingAgent | IAgent>
  brand: UUID
  can_approve: boolean
  confirm_notification_type: INotificationDeliveryType[]
  cancel_notification_type: INotificationDeliveryType[]
  user_id: UUID
  agent_id: UUID
}
