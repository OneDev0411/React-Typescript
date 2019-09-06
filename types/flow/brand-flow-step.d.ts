declare type TBrandFlowStepAssociation = 'email' | 'event'

declare type TBrandFlowStep<
  Associations extends TBrandFlowStepAssociation = ''
> = {
  created_at: number
  created_by: UUID
  description: string | null
  due_in: number
  flow: UUID
  id: UUID
  is_automated: boolean
  title: string
  type: 'brand_flow_step'
  updated_at: number
  updated_by: UUID | null
} & Association<'email', IBrandEmail | null, Associations> &
  Association<'event', IBrandEvent | null, Associations>
