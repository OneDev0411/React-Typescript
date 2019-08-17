declare interface IBrandFlowStep extends IModel {
  title: string
  description?: string
  due_in: number
  flow: UUID
  event: IBrandEvent | null
  email: IBrandEmailTemplate | null
  is_automated: boolean
  type: 'brand_flow_step'
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

declare interface IBrandFlow extends IModel {
  brand: UUID
  name: string
  description: string
  type: 'brand_flow'
  active_flows: number
  is_editable: boolean
  steps?: IBrandFlowStep[]
}

declare interface IBrandFlowInput {
  name: string
  description: string
  steps: IBrandFlowStepInput[]
}
