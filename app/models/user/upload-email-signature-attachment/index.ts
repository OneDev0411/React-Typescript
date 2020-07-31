import { upload } from '../../upload'

export function uploadEmailSignatureAttachment(
  attachment: File | IFile
): ReturnType<typeof upload> {
  return upload('/users/self/email_signature_attachments', attachment)
}
