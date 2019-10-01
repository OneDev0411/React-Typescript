import { SuperAgentRequest } from 'superagent'

import { upload } from '../upload'

type UploadFile = (file: File | IFile) => SuperAgentRequest

export const uploadEmailAttachment: UploadFile = upload('/emails/attachments')

export const uploadGoogleAttachment = (
  credentialId: string,
  file: File | IFile
) => upload(`/users/self/google/${credentialId}/attachments`, file)

export const uploadMicrosoftAttachment = (
  credentialId: string,
  file: File | IFile
) => upload(`/users/self/microsoft/${credentialId}/attachments`, file)
