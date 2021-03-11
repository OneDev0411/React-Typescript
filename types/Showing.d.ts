declare interface IShowing extends IModel<'showing'> {
  brand: UUID
  aired_at?: number
  start_date: string
  end_date?: string
  duration: number
  notice_period?: number
  feedback_template?: IMarketingTemplateInstance
  deal?: IDeal
  listing?: IListing
  address?: Address
  gallery?: Gallery
  roles: IShowingRole[]
  appointments: IAppointment[]
}

declare interface IAppointment extends IModel<'appointment'> {
  source: string
  time: string
  status: IAppointmentStatus
  contact: IContact
}

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

declare type IAppointmentStatus =
  | 'Pending'
  | 'Approved'
  | 'Rescheduled'
  | 'Cancelled'
  | 'Finished'
