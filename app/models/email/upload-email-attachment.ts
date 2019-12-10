import { SuperAgentRequest } from 'superagent'

import { upload } from '../upload'

type UploadFile = (file: File | IFile) => SuperAgentRequest

export const uploadEmailAttachment: UploadFile = upload('/emails/attachments')
