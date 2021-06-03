declare type WaitForField = 'hours' | 'days' | 'weeks' | 'months' | 'years'
declare interface IBaseBrandFlowStep {
  title: string
  description?: string
  order: number
  wait_for: Partial<Record<WaitForField, number>>
  time: string
  event_type: string
}
declare interface IBrandFlowStep
  extends IModel<'brand_flow_step'>,
    IBaseBrandFlowStep {
  flow: UUID
  event: Nullable<IBrandEvent>
  email: Nullable<IBrandEmailTemplate>
  is_automated: boolean
  template: Nullable<IBrandMarketingTemplate>
  template_instance: Nullable<IMarketingTemplateInstance>
}

declare interface IBrandFlowStepInput extends IBaseBrandFlowStep {
  event?: IBrandEventInput
  email?: UUID
  template?: UUID
  template_instance?: UUID
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
