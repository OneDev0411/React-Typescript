interface ITriggerBase {
  created_by: UUID
  brand: UUID
  user: UUID
  wait_for: number
  time: string
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
  campaign?: IEmailCampaign
}

declare type ITriggerRaw = ITriggerBase & IContactTrigger & IEmailAction

declare type ITrigger = IModel<'trigger'> &
  ITriggerRaw & {
    executed_at: number
  }

declare type IGlobalTriggerRaw = Omit<
  ITriggerBase,
  'user' | 'time' | 'recurring'
> &
  Pick<IContactTrigger, 'event_type'>

declare interface IGlobalTriggerInput extends IGlobalTriggerRaw {
  template?: UUID
  template_instance?: UUID
}

declare interface IGlobalTrigger extends IModel<'trigger'>, IGlobalTriggerRaw {
  template: Nullable<IBrandMarketingTemplate>
  template_instance: Nullable<IMarketingTemplateInstance>
}
