import { EmailThreadEmail } from '../types'
import {
  isGoogleMessage,
  isMicrosoftMessage
} from '../../EmailCompose/helpers/type-guards'

export function normalizeThreadMessageToThreadEmail(
  message: IEmailThreadMessage
): EmailThreadEmail {
  return message.type === 'email'
    ? normalizeEmailToThreadEmail(message)
    : {
        id: message.id,
        from: message.from,
        inBound: message.in_bound,
        threadId: message.thread_id,
        attachments: message.attachments,
        to: message.to,
        cc: message.cc,
        bcc: message.bcc,
        date: new Date(message.message_date * 1000),
        htmlBody: message.html_body || '',
        internetMessageId: message.internet_message_id,
        messageId: message.message_id,
        snippet: message.snippet,
        subject: message.subject || '',
        microsoftId: isGoogleMessage(message)
          ? undefined
          : message.microsoft_credential,
        googleId: isMicrosoftMessage(message)
          ? undefined
          : message.google_credential
      }
}

function normalizeEmailToThreadEmail(email: IEmail): EmailThreadEmail {
  return {
    id: email.id,
    from: email.from,
    to: email.to,
    cc: email.cc,
    bcc: email.bcc,
    htmlBody: '', // FIXME
    messageId: email.headers.message_id,
    date: new Date(email.created_at * 1000),
    attachments: [], // FIXME,
    inBound: false,
    subject: email.subject,
    snippet: '', // FIXME,
    microsoftId: email.microsoft_id || undefined,
    googleId: email.google_id || undefined
  }
}
