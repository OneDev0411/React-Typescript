import { EmailFormValues } from '../../types'

export function isFileAttachment(
  attachment: EmailFormValues['attachments'][number]
): attachment is IFile {
  return !!(attachment as IFile).id
}
