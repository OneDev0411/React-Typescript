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
  address?: IStdAddr
  gallery?: IMediaGallery
  roles: IShowingRole[]
  appointments: IAppointment[]
  approval_type: IShowingApprovalType
}
