export interface TriggerDataInput
  extends Pick<ITrigger, 'wait_for' | 'event_type' | 'time' | 'recurring'> {
  action?: 'schedule_email' | 'create_event'
  subject: string
}
