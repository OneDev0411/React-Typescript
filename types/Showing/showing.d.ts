declare type Weekday =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

declare interface IShowingAvailability extends IModel<'showing_availability'> {
  showing: UUID
  weekday: Weekday
  availability: [number, number]
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

declare interface IBaseShowing {
  brand: UUID
  start_date: string
  end_date: string | null
  duration: number
  availabilities: IShowingAvailability[]
  listing: IListing | null
  address: unknown // TODO: use std address
  gallery: unknown // TODO: use gallery
  notice_period: number | null
  same_day_allowed: boolean
}

declare interface IShowing extends IModel<'showing'>, IBaseShowing {
  aired_at: number | null
  deal: IDeal | null
  address: Address | null
  roles: IShowingRole[]
  appointments: IAppointment[]
}

declare interface IPublicShowing
  extends IModel<'public_showing'>,
    IBaseShowing {
  unavailable_times: string[] | null
  agent: IAgent
  timezone: string
  timezone_offset: number
}
