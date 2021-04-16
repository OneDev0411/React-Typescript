declare type IShowingSource = 'Website'

type IShowingAppointmentAssociations = 'contact'

declare interface IShowingAppointment<
  A extends IShowingAppointmentAssociations = ''
> extends IModel<'showing_appointment'>,
    Association<'contact', IContact, A> {
  source: IShowingSource
  time: string
  status: IAppointmentStatus
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
