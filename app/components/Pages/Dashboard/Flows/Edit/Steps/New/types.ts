export type RawWaitFor = {
  value: number
  unit: WaitForField
  triggerAt: 'after' | 'before'
}

export interface BaseFormProps {
  index: number
  step?: Nullable<IBrandFlowStep>
  disableEdit?: boolean
  isDirty?: boolean
  prevStepOrder?: Nullable<number>
  onSubmit: (data: IBrandFlowStepInput, stepId?: UUID) => Promise<any>
  onDelete?: (data: IBrandFlowStep) => Promise<any>
  onMoveUpStep?: () => void
  onMoveDownStep?: () => void
  makeDirtyStep?: () => void
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
  template: Nullable<IMarketingTemplateInstance | IBrandMarketingTemplate>
}
