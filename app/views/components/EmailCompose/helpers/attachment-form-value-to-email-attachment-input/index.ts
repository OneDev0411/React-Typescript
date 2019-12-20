import { EmailFormValues } from '../../types'
import { isFileAttachment } from '../is-file-attachment'

export function attachmentFormValueToEmailAttachmentInput(
  attachment: EmailFormValues['attachments'][number]
): IEmailAttachmentInput {
  return isFileAttachment(attachment)
    ? {
        file: attachment.id,
        is_inline: false
      }
    : {
        url: attachment.url,
        name: attachment.name,
        is_inline: false
      }
}
