declare interface IShowing extends IModel<'showing'> {
  brand: UUID
  aired_at?: number
  start_date: string
  end_date?: string
  duration: number
  notice_period?: number
  approval_type: IShowingApprovalType
  feedback_template?: IMarketingTemplateInstance
  deal?: IDeal
  listing?: IListing
  address?: IStdAddr
  gallery?: IMediaGallery
  roles: IShowingRole[]
  appointments: IAppointment[]
  availabilities: ShowingAvailability[]
}
