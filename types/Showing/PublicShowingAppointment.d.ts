declare type IPublicShowingAppointmentAssociations = 'showing'

declare interface IPublicShowingAppointment<
  A extends IPublicShowingAppointmentAssociations = ''
> extends IModel<'public_showing_appointment'>,
    IBaseShowingAppointment {
  showing: A extends 'showing' ? IPublicShowing : never
  token: string
  cancel_token: string
}
