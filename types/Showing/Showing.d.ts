declare interface IShowing extends IModel<'showing'>, IBaseShowing {
  aired_at?: string
  approval_type: IShowingApprovalType
  feedback_template?: IMarketingTemplateInstance
  deal?: IDeal
  address?: IStdAddr
  gallery?: IMediaGallery
  roles: IShowingRole[]
  appointments: Nullable<IShowingAppointment[]>
  allow_appraisal: boolean
  allow_inspection: boolean
  instructions?: string
  confirmed: number
  visits: number
  human_readable_id: number
}
