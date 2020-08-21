import { SuperAgentRequest } from 'superagent'

import Fetch from 'services/fetch'

function isExistingFile(attachment: File | IFile): attachment is IFile {
  return !(attachment instanceof File) && !!attachment.id
}

/**
 * The request object is intentionally returned to give access to
 * progress as well as aborting request, which is useful for file uploading
 */
export function upload(
  path: string,
  attachment: File | IFile,
  query?: Record<string, string>
): SuperAgentRequest {
  const request = new Fetch().post(path).query(query ?? {})

  if (isExistingFile(attachment)) {
    request.send({ file: attachment.id })
  }

  if (attachment instanceof File) {
    request.attach('file', attachment)
  }

  return request
}
