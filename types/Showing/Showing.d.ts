declare interface IShowing extends IModel<'showing'> {
  brand: UUID
  aired_at?: string
  start_date: string
  end_date?: string
  duration: number
  notice_period?: number
  same_day_allowed: boolean
  approval_type: IShowingApprovalType
  feedback_template?: IMarketingTemplateInstance
  deal?: IDeal
  listing?: IListing
  address?: IStdAddr
  gallery?: IMediaGallery
  roles: IShowingRole[]
  appointments: IShowingAppointment[]
  availabilities: IShowingAvailability[]
  allow_appraisal: boolean
  allow_inspection: boolean
  instructions?: string
  confirmed: number
  visits: number
  token: string
}
