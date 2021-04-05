declare interface ShowingRoleInput {
  role: IShowingRoleType
  user: UUID
  brand: UUID
  can_approve: boolean
  confirm_notification_type: INotificationDeliveryType[]
  cancel_notification_type: INotificationDeliveryType[]
  first_name: string
  last_name: string
  email: string
  phone_number: string
}
