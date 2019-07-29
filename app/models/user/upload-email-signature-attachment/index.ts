import { upload } from '../../upload'

export const uploadEmailSignatureAttachment = upload(
  '/users/self/email_signature_attachments'
)
