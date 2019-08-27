declare interface IEmailRecipientListInput {
  list: UUID
}
declare interface IEmailRecipientTagInput {
  tag: string
}
declare interface IEmailRecipientEmailInput {
  email: string
  contact?: UUID
}

declare type IEmailRecipientInput =
  | IEmailRecipientEmailInput
  | IEmailRecipientListInput
  | IEmailRecipientTagInput

declare type TIsTagPresent = TIsPropertyPresent<
  IEmailRecipientInput,
  IEmailRecipientTagInput,
  'tag'
>
declare type TIsListPresent = TIsPropertyPresent<
  IEmailRecipientInput,
  IEmailRecipientListInput,
  'list'
>
declare type TIsEmailPresent = TIsPropertyPresent<
  IEmailRecipientInput,
  IEmailRecipientEmailInput,
  'email'
>

declare type EmailCampaignRecipientAssociation = 'contact' | 'list'

declare type IEmailRecipient<
  Associations extends EmailCampaignRecipientAssociation = ''
> = {
  campaign: UUID
  created_at: string
  deleted_at: null | string
  eid: UUID
  email: null | string
  id: UUID
  ord: string
  recipient_type: 'CC' | 'BCC' | 'To'
  tag: string
  type: 'email_campaign_recipient'
  updated_at: null | string
} & Association<'contact', IContact, Associations> &
  Association<'list', IContactList, Associations>

declare interface IEmailCampaignInputBase {
  due_at: Date | null
  from: UUID
  to: IEmailRecipientInput[]
  subject: string
  html: string
  text?: string
  attachments?: UUID[]
  /**
   * @deprecated, This is not used in practice and is added in initial
   * implementation by the API. It should be removed.
   */
  include_signature?: boolean
}

declare interface IIndividualEmailCampaignInput
  extends IEmailCampaignInputBase {}

declare interface IEmailCampaignInput extends IEmailCampaignInputBase {
  cc?: IEmailRecipientInput[]
  bcc?: IEmailRecipientInput[]
}

declare type EmailCampaignAssociation =
  | 'emails'
  | 'template'
  | 'from'
  | 'recipients'
  | 'attachments'

declare type IEmailCampaign<
  Associations extends EmailCampaignAssociation = '',
  RecipientAssociations extends EmailCampaignRecipientAssociation = ''
> = {
  id: UUID
  created_at: number
  updated_at: null | number
  deleted_at: null | number
  created_by: UUID
  brand: UUID
  subject: string
  include_signature: boolean
  html: string
  due_at: number
  executed_at: null | number
  individual: boolean
  accepted: number
  rejected: number
  delivered: number
  failed: number
  opened: number
  clicked: number
  unsubscribed: number
  complained: number
  stored: number
  text: string
  type: 'email_campaign'
  sent: number
} & Association<
  'recipients',
  IEmailRecipient<RecipientAssociations>[],
  Associations
> &
  Association<'from', IUser, Associations> &
  Association<'list', IContactList, Associations> &
  Association<'template', IMarketingTemplateInstance, Associations> &
  Association<'emails', any[], Associations> &
  Association<'attachments', IFile[], Associations>

declare interface IEmail {
  domain?: string
  to: string
  from: string
  subject: string
  html: string
  text?: string
  headers?: any
}
