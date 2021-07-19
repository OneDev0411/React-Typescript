export type ShowingRoleFormValues = Pick<
  IShowingRole,
  | 'role'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone_number'
  | 'confirm_notification_type'
  | 'cancel_notification_type'
  | 'user'
  | 'can_approve'
>

export interface CreateContactInput {
  first_name: string
  last_name: string
  email: string
  phone_number: string
}
