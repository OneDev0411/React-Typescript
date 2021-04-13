declare interface IShowingInput {
  aired_at?: string
  start_date: string
  end_date?: string
  duration: number
  notice_period?: number
  approval_type: IShowingApprovalType
  feedback_template?: UUID
  deal?: UUID
  listing?: UUID
  address?: StdAddr
  gallery?: UUID
  roles: IShowingRoleInput[]
  availabilities: IShowingAvailabilityInput[]
  allow_appraisal: boolean
  allow_inspection: boolean
  instructions?: string
  brand: UUID
}
