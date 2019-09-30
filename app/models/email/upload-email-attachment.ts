import { SuperAgentRequest } from 'superagent'

import { upload } from '../upload'

export const uploadEmailAttachment: (
  file: File | IFile
) => SuperAgentRequest = upload('/emails/attachments')

export const uploadGoogleAttachment = (
  credentialId: string,
  attachment: File | IFile
) => upload(`/users/self/google/${credentialId}/attachments`, attachment)

export const uploadMicrosoftAttachment = (
  credentialId: string,
  attachment: File | IFile
) => upload(`/users/self/microsoft/${credentialId}/attachments`, attachment)
