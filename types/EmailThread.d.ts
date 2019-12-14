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
  updated_at: number
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
  text_body?: string
  thread_id: string
  thread_key: string
  is_read: boolean
  to: string[]
  to_raw: IRawEmailRecipient[]
  unique_body?: string
  is_read: boolean
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
declare type IEmailThreadMessage =
  | IGoogleMessage
  | IMicrosoftMessage
  | IEmail<'html' | 'text'>

type IEmailThreadAssociations = 'messages' | 'contacts'

declare type IEmailThread<
  Associations extends IEmailThreadAssociations = ''
> = {
  id: UUID
  subject: string
  created_at: number
  updated_at: number
  first_message_date: number
  last_message_date: number
  recipients: string[]
  recipients_raw: IRawEmailRecipient[]
  senders_raw: IRawEmailRecipient[]
  message_count: number
  snippet?: string
  has_attachments: boolean
  is_read: boolean
  brand: UUID
  user: UUID
  google_credential: UUID | undefined
  microsoft_credential: UUID | undefined
  type: 'email_thread'
} & Association<'messages', IEmailThreadMessage[], Associations> &
  Association<'contacts', (IContact & IContactSummary)[] | null, Associations>

declare type IThreadCredentialKeys =
  | 'google_credential'
  | 'microsoft_credential'
