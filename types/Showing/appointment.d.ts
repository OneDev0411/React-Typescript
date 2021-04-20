declare type IShowingSource = 'Website'

declare type IShowingAppointmentStatus =
  | 'Pending'
  | 'Approved'
  | 'NeedsRescheduling'
  | 'Rescheduled'
  | 'Cancelled'
  | 'Finished'

type IShowingAppointmentAssociations = 'showing'

declare interface IShowingAppointment<
  A extends IShowingAppointmentAssociations = ''
> extends IModel<'showing_appointment'>,
    Association<'showing', IPublicShowing, A> {
  source: IShowingSource
  time: string
  status: IShowingAppointmentStatus
}

declare interface IShowingAppointmentInput {
  source: IShowingSource
  time: string // "2021-04-05T09:00:00+00:00"
  contact: Partial<IContact> & {
    first_name: string
    last_name: string
    phone_number: string
    email?: string
    company?: string
  }
}

declare interface IPublicShowingAppointment<
  A extends IShowingAppointmentAssociations = ''
> extends IModel<'showing_appointment_public'> {
  status: IShowingAppointmentStatus
  time: string
  showing: A extends 'showing' ? IPublicShowing : never
}
