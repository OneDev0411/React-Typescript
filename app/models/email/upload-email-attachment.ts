import { upload } from '../upload'

export type UploadOrigin = 'gmail' | 'outlook' | 'mailgun'

export function uploadEmailAttachment(
  file: File | IFile,
  origin?: UploadOrigin
): ReturnType<typeof upload> {
  return upload('/emails/attachments', file, origin && { origin })
}
