declare interface IShowingRolePerson {
  first_name: string
  last_name: string
  email: string
  phone_number: string
}

declare interface IShowingRoleNotification {
  can_approve: boolean
  confirm_notification_type: INotificationDeliveryType[]
  cancel_notification_type: INotificationDeliveryType[]
}

declare interface IShowingRole
  extends IShowingRolePerson,
    IShowingRoleNotification,
    IModel<'showing_role'> {
  showing: UUID
  created_by: number
  role: IShowingRoleType
  user: UUID
  brand: UUID
}
