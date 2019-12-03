import { EmailFormValues } from '../../types'
import { isFileAttachment } from '../is-file-attachment'

export function attachmentFormValueToEmailAttachmentInput(
  attachment: EmailFormValues['attachments'][number]
): IEmailAttachmentInput {
  return {
    file: isFileAttachment(attachment) ? attachment.id : undefined,
    is_inline: false,
    url: attachment.url
  }
}
