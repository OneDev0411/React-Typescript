import clip from 'text-clipper'

import {
  isGoogleMessage,
  isMicrosoftMessage
} from '../../EmailCompose/helpers/type-guards'
import { EmailThreadEmail } from '../types'

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
        campaign: message.campaign,
        to: message.to,
        cc: message.cc,
        bcc: message.bcc,
        date: new Date(message.message_date * 1000),
        htmlBody: message.html_body || '',
        internetMessageId: message.internet_message_id,
        messageId: message.message_id,
        isRead: message.is_read,
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

function normalizeEmailToThreadEmail(
  email: IEmail<'html' | 'text'>
): EmailThreadEmail {
  return {
    id: email.id,
    from: email.from,
    to: email.to,
    cc: email.cc,
    bcc: email.bcc,
    htmlBody: email.html,
    messageId: email.headers && email.headers.message_id,
    date: new Date(email.created_at * 1000),
    attachments: (email.attachments ?? []).map(
      convertEmailCampaignAttachmentToEmailAttachment
    ),
    campaignId: email.campaign,
    inBound: false,
    isRead: email.is_read,
    subject: email.subject,
    snippet: clip(email.text, 50, { indicator: '' }),
    microsoftId: email.microsoft_id || undefined,
    googleId: email.google_id || undefined
  }
}

function convertEmailCampaignAttachmentToEmailAttachment(
  attachment: IEmailCampaignAttachment
): IEmailAttachment {
  return {
    cid: attachment.content_id ?? '',
    id: attachment.id,
    isInline: attachment.is_inline,
    name: attachment.file.name,
    contentType: attachment.file.mime,
    size: 0,
    url: attachment.file.url
  }
}
