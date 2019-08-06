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

declare interface IEmailRecipient {
  contact?: UUID
  email: string
}

declare interface IEmailCampaignInput {
  id?: UUID
  due_at: string | null
  from: UUID
  to: IEmailRecipientInput[]
  cc?: IEmailRecipientInput[]
  bcc?: IEmailRecipientInput[]
  subject: string
  html: string
  text?: string
  attachments?: UUID[]
  include_signature?: boolean
  individual?: boolean
}

declare interface IEmailCampaign extends IEmailCampaignInput {
  text: string
  id: UUID
}

declare interface IEmail {
  domain?: string
  to: string
  from: string
  subject: string
  html: string
  text?: string
  headers?: any
}
