declare type IShowingSource = 'Website'

declare interface IAppointment extends IModel<'appointment'> {
  source: IShowingSource
  time: string
  status: IAppointmentStatus
  contact: IContact
}

declare interface IAppointmentInput {
  source: IShowingSource
  time: string // "2021-04-05T09:00:00+00:00"
  contact: {
    first_name: string
    last_name: string
    phone_number: string
    email?: string
    company?: string
  }
}
