export type EmailResponseType = 'reply' | 'replyAll' | 'forward'

/**
 * This is a normalized version of email objects used in email thread UI.
 * This doesn't correspond to a an email type from server but we normalize
 * different types into it via a handful of helpers.
 * This is created because:
 * - Different types of emails may be shown in thread UI: such as
 *   {@link IGoogleMessage}, {@link IMicrosoftMessage}, {@link IEmail},
 *   {@link IEmailCampaign} and {@link IEmailCampaignEmail}
 * - Prevent propagation of changes in different types of emails into
 * {@link EmailThreadItem} and a bunch of its sub-components. This way
 * changes will be limited to helpers used for normalization.
 * - It's more efficient than passing smaller pieces of data (like to, from,
 * body, ...) as more fine-grained props to {@link EmailThreadItem} because
 * a bunch of sub-components and functions also work on a subset of email
 * fields and therefore it's more convenient to pass email to them as a whole.
 * In other words, having a definition of email makes the API for these
 * components and functions more succinct.
 */
export interface EmailThreadEmail {
  id: string
  from: string
  subject: string
  to: string[]
  cc: string[]
  bcc: string[]
  htmlBody: string
  attachments: IEmailAttachment[]
  snippet: string
  date: Date
  inBound: boolean
  isRead: boolean

  messageId?: string
  internetMessageId?: string
  threadId?: string
  thread?: IEmailThread<IEmailThreadAssociations>

  microsoftId: string | undefined
  googleId: string | undefined
}
