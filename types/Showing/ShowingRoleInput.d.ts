declare interface IShowingRoleInput {
  role: IShowingRoleType
  user: Optional<UUID>
  agent?: IShowingAgent
  brand: UUID
  first_name: string
  last_name: string
  email: string
  phone_number: string
  can_approve: boolean
  confirm_notification_type: INotificationDeliveryType[]
  cancel_notification_type: INotificationDeliveryType[]
}
