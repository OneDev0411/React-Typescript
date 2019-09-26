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
  origin: 'outlook' | 'gmail' | 'rechat_email'
  owner: 'rechat_email' extends this['origin'] ? null : UUID // // seems can be null. Check it
  owner_name: string // // seems can be null. Check it
  owner_email: string // seems can be null. Check it
  snippet: string
  subject: string
  text_body: null | string
  thread_id: string
  thread_key: string
  to: string[]
  unique_body: string
}

declare type IEmailThreadEmailInput = Pick<
  IEmailThreadEmail,
  'to' | 'cc' | 'bcc' | 'subject'
> & {
  html: string
  text?: string
  attachments: IEmailAttachmentInput[]
  threadId?: string
}

declare type IEmailThread = IEmailThreadEmail[]
