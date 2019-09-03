declare type TBrandFlowAssociation = 'steps'

declare type TBrandFlow<
  Associations extends TBrandFlowAssociation = '',
  StepAssociations extends TBrandFlowStepAssociation = ''
> = {
  active_flows: number
  brand: UUID
  created_at: number
  created_by: UUID
  description: string | null
  id: UUID
  is_editable: boolean
  name: string
  type: 'brand_flow'
  updated_at: number
  updated_by: UUID | null
} & Association<
  'steps',
  TBrandFlowStep<StepAssociations>[] | null,
  Associations
>
