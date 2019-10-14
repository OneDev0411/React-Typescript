import { convertToAbsoluteAttachmentUrl } from './convert-to-absolute-attachment-url'

export function attachmentToFile(attachment: IEmailAttachment) {
  return {
    url: convertToAbsoluteAttachmentUrl(attachment.url),
    name: attachment.name,
    preview_url: convertToAbsoluteAttachmentUrl(attachment.url),
    mime: attachment.contentType,
    type: 'file'
  } as IFile
}
