declare interface IShowingInput {
  start_date: string
  end_date?: string
  duration: number
  aired_at?: string
  notice_period?: number
  same_day_allowed: boolean
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

declare interface IShowingInputAPI extends Omit<IShowingInput, 'agent'> {
  roles: IShowingRoleInputAPI[]
}
