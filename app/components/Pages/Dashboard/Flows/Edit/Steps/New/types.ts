export type RawWaitFor = {
  value: number
  unit: WaitForField
  triggerAt: 'after' | 'before'
}

interface BaseFormData
  extends Pick<IBrandFlowStepInput, 'title' | 'description' | 'time'> {
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
  template_instance: UUID
}
