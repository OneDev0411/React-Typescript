declare interface IShowingAppointmentInput {
  source: IShowingSource
  time: string
  contact: {
    first_name: string
    last_name: string
    phone_number: string
    email?: string
    company?: string
  }
}
