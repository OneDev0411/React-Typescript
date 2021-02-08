type BaseFormData = Pick<IBrandFlowStepInput, 'title' | 'description' | 'time'>

export type RawWaitFor = {
  value: number
  unit: WaitForField
  triggerAt: 'after' | 'before'
}

export interface EventFormData extends BaseFormData {
  task_type: {
    title: string
    value: TTaskType
  }
  wait_for: RawWaitFor
}

export interface ScheduledFormData extends BaseFormData {
  wait_for: RawWaitFor
  email_template: UUID
}
