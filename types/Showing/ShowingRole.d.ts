declare interface IShowingRole extends IModel<'showing_role'> {
  role: IDealRole
  user: UUID
  brand: UUID
  approval_required: boolean
  notified_by_email: boolean
  notified_by_sms: boolean
  first_name: string
  last_name: string
  email: string
  phone_number: string
}
