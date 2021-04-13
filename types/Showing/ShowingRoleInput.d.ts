declare interface IShowingRoleInputNotification {
  can_approve: boolean
  confirm_notification_type: INotificationDeliveryType[]
  cancel_notification_type: INotificationDeliveryType[]
}

declare interface IShowingRoleInputPerson {
  user: UUID
  brand: UUID
  first_name: string
  last_name: string
  email: string
  phone_number: string
}

declare interface IShowingRoleInput
  extends IShowingRoleInputNotification,
    IShowingRoleInputPerson {
  role: IDealRoleType
}
