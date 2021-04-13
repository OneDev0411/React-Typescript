declare interface IShowingRole extends IModel<'showing_role'> {
  showing: UUID
  created_by: number
  role: IDealRoleType
  first_name: string
  last_name: string
  email: string
  phone_number: string
  user: UUID
  brand: UUID
  can_approve: boolean
  confirm_notification_type: INotificationDeliveryType[]
  cancel_notification_type: INotificationDeliveryType[]
}
