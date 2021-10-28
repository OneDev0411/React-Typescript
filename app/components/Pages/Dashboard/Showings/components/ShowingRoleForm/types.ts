import { ShowingRoleInput } from '../../types'

export type ShowingRoleFormValues = Pick<
  ShowingRoleInput,
  | 'role'
  | 'agent'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone_number'
  | 'confirm_notification_type'
  | 'cancel_notification_type'
  | 'user'
  | 'can_approve'
  | 'contact'
  | 'save_to_contact'
>

export interface CreateContactInput {
  first_name: string
  last_name: string
  email: string
  phone_number: string
}
