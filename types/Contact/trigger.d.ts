interface ITriggerBase {
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
  campaign?: IEmailCampaign<'from'>
}

declare type ITriggerRaw = ITriggerBase & IContactTrigger & IEmailAction

declare type ITrigger = IModel<'trigger'> &
  ITriggerRaw & {
    executed_at: number
  }

declare type IGlobalTriggerRaw = Omit<
  ITriggerBase,
  'user' | 'time' | 'recurring' | 'created_by'
> &
  Pick<IContactTrigger, 'event_type'> & { subject: string }

declare interface IGlobalTriggerFormData
  extends Omit<IGlobalTriggerRaw, 'brand' | 'event_type'> {
  template: Nullable<IBrandMarketingTemplate | IMarketingTemplateInstance>
}

declare type IGlobalTriggerAssociations = 'template' | 'template_instance'

declare interface IGlobalTrigger<A extends IGlobalTriggerAssociations = ''>
  extends IModel<'trigger'>,
    IGlobalTriggerRaw {
  template: Nullable<'template' extends A ? IBrandMarketingTemplate : UUID>
  template_instance: Nullable<
    'template_instance' extends A ? IMarketingTemplateInstance : UUID
  >
}

declare type IGlobalTriggerInput = Omit<
  IGlobalTrigger,
  'id' | 'template' | 'type' | 'created_at' | 'updated_at'
>
