declare interface IEmailThreadEmail {
  attachments: unknown[]
  bcc: string[]
  cc: string[]
  from: string
  has_attachments: boolean
  html_body: string
  id: UUID
  in_bound: boolean
  message_date: string
  message_id: string
  origin: 'outlook' // FIXME
  owner: UUID
  snippet: string
  subject: string
  text_body: null | string
  thread_id: string
  thread_key: string
  to: string[]
  unique_body: string
}

declare type IEmailThread = IEmailThreadEmail[]
