import { convertToAbsoluteAttachmentUrl } from './convert-to-absolute-attachment-url'
import { EmailThreadFormValues } from '../../EmailCompose'

export function attachmentToFile(
  attachment: IEmailAttachment
): EmailThreadFormValues['attachments'][number] {
  return {
    url: convertToAbsoluteAttachmentUrl(attachment.url),
    name: attachment.name,
    preview_url: convertToAbsoluteAttachmentUrl(attachment.url),
    mime: attachment.contentType,
    type: 'file'
  }
}
