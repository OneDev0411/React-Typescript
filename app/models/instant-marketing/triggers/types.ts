export interface TriggerDataInput
  extends Pick<ITrigger, 'wait_for' | 'event_type'> {
  action?: 'schedule_email' | 'create_event'
  subject: string
}

export interface TriggerTemplateInput {
  id: UUID
  markup: string
}
