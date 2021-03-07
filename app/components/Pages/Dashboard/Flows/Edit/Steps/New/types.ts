export type RawWaitFor = {
  value: number
  unit: WaitForField
  triggerAt: 'after' | 'before'
}

export interface BaseFormProps {
  index: number
  disableEdit?: boolean
  step?: IBrandFlowStep
  onDelete?: (data: IBrandFlowStep) => Promise<any>
  onSubmit: (data: IBrandFlowStepInput, stepId?: UUID) => Promise<any>
}

export interface BaseFormData
  extends Pick<
    IBrandFlowStepInput,
    'title' | 'description' | 'time' | 'event_type'
  > {
  wait_for: RawWaitFor
}

export interface EventFormData extends BaseFormData {
  task_type: {
    title: string
    value: TTaskType
  }
}

export interface BasicEmailFormData extends BaseFormData {
  email_template: UUID
}

export interface MarketingEmailFormData extends BaseFormData {
  template: Nullable<{
    id: UUID
    isInstance: boolean
  }>
}
