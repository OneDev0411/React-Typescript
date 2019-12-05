declare interface IEmailAttachment {
  contentType: string
  id: string
  cid: string
  isInline: boolean
  name: string
  size: number
  url: string
}

declare interface IRawEmailRecipient {
  name: string
  address: string
}

declare interface IEmailThreadEmailBase<T> {
  attachments: IEmailAttachment[]
  bcc: string[]
  bcc_raw: IRawEmailRecipient[]
  cc: string[]
  cc_raw: IRawEmailRecipient[]
  created_at: number
  from: string
  from_raw: IRawEmailRecipient
  has_attachments: boolean
  html_body: string | null
  id: UUID
  in_bound: boolean
  in_reply_to: string | null
  internet_message_id: string
  message_date: number
  message_id: string
  recipients: string[]
  snippet: string
  subject: string | null
  text_body: string
  thread_id: string
  thread_key: string
  to: string[]
  to_raw: IRawEmailRecipient[]
  unique_body: string
  type: T
}

declare interface IGoogleMessage
  extends IEmailThreadEmailBase<'google_message'> {
  google_credential: UUID
}
declare interface IMicrosoftMessage
  extends IEmailThreadEmailBase<'microsoft_message'> {
  microsoft_credential: UUID
}
declare interface IEmail {
  id: UUID
  created_at: number
  from: string
  to: string[]
  subject: string
  headers: IEmailCampaignInput['headers'] // ask
  mailgun_id: string
  domain: 'Marketing' // ask
  campaign: UUID
  cc: string[]
  bcc: string[]
  accepted: number
  rejected: number
  delivered: number
  failed: number
  opened: number
  clicked: number
  unsubscribed: number
  complained: number
  stored: number
  google_id: null | string
  microsoft_id: null | string
  tracking_id: UUID
  type: 'email'
}
declare type IEmailThreadMessage = IGoogleMessage | IMicrosoftMessage | IEmail

type IEmailThreadAssociations = 'messages'

declare type IEmailThread<
  Associations extends IEmailThreadAssociations = ''
> = {
  subject: string
  first_message_date: number
  last_message_date: number
  recipients: string[]
  message_count: number
  has_attachments: boolean
  brand: UUID
  google_credential: UUID | undefined
  microsoft_credential: UUID | undefined
} & Association<'messages', IEmailThreadMessage[], Associations>
