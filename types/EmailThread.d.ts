declare interface IEmailAttachment {
  contentType: string
  id: string
  isInline: boolean
  name: string
  size: number
  url: string
}

declare interface IEmailAttachmentInput {
  type: string
  isInline: boolean
  filename: string
  contentId: string
  link: string
}

declare interface IEmailThreadEmail {
  attachments: IEmailAttachment[]
  bcc: string[]
  cc: string[]
  from: string
  has_attachments: boolean
  html_body: string
  id: UUID
  in_bound: boolean
  message_date: string
  message_id: string
  internet_message_id: string
  origin: 'outlook' | 'gmail' | 'rechat_email'
  owner: UUID | null
  owner_name: string | null
  owner_email: string | null
  snippet: string
  subject: string
  text_body: null | string
  thread_id: string
  thread_key: string
  to: string[]
  unique_body: string
}

declare interface IEmailThreadRecipient {
  name: string
  address: string
}

declare interface IEmailThreadEmailInput {
  subject: string
  to: IEmailThreadRecipient[]
  cc: IEmailThreadRecipient[]
  bcc: IEmailThreadRecipient[]
  html: string
  text?: string
  attachments: IEmailAttachmentInput[]
  threadId?: string
  messageId?: string
  inReplyTo?: string
}

declare type IEmailThread = IEmailThreadEmail[]
