import curry from 'lodash/curry'

import Fetch from 'services/fetch'

function isUrlFileInput(
  attachment: File | IUrlFileInput
): attachment is IUrlFileInput {
  return !(attachment instanceof File) && !!attachment.url
}

export const upload = curry(async function upload(
  path: string,
  attachment: File | IUrlFileInput
): Promise<IFile> {
  const request = new Fetch().post(path)

  if (isUrlFileInput(attachment)) {
    request.send(attachment)
  }

  if (attachment instanceof File) {
    request.attach('file', attachment)
  }

  const response = await request

  return response.body.data
})
