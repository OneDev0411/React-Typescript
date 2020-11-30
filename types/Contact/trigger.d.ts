interface ITriggerBase {
  created_by: UUID
  brand: UUID
  user: UUID
  wait_for: number
  recurring: boolean
}

declare type TriggerContactEventTypes =
  | 'birthday'
  | 'wedding_anniversary'
  | 'home_anniversary'
  | 'child_birthday'

declare interface IContactTrigger {
  event_type: TriggerContactEventTypes
  contact: UUID
}

interface IEventAction {
  action: 'create_event'
  brand_event: UUID
}
type IEmailAction = {
  action: 'schedule_email'
  campaign: UUID | IEmailCampaign
}

declare type ITriggerRaw = ITriggerBase & IContactTrigger & IEmailAction

declare type ITrigger = IModel<'trigger'> &
  ITriggerRaw & {
    executed_at: number
  }
