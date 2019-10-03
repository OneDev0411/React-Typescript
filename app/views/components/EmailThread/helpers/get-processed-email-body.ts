import { getAttachmentUrl } from './get-attachment-url'

export function getProcessedEmailBody(email: IEmailThreadEmail) {
  return () =>
    email.attachments.reduce(
      (body, attachment) =>
        body.replace(`cid:${attachment.cid}`, getAttachmentUrl(attachment)),
      email.html_body || ''
    )
}
