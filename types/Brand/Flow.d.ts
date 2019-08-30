declare interface IBrandFlowStep extends IModel<'brand_flow_step'> {
  title: string
  description?: string
  due_in: number
  flow: UUID
  event: IBrandEvent | null
  email: IBrandEmailTemplate | null
  is_automated: boolean
  // virtual (calculated) fields
  wait_days: number
}

declare interface IBrandFlowStepInput {
  title: string
  description?: string
  due_in: number
  event?: IBrandEventInput
  email?: UUID
}

declare interface IBrandFlow extends IModel<'brand_flow'> {
  brand: UUID
  name: string
  description: string
  active_flows: number
  is_editable: boolean
  steps?: IBrandFlowStep[]
}

declare interface IBrandFlowInput {
  name: string
  description: string
  steps: IBrandFlowStepInput[]
}
