import Fetch from 'services/fetch'

function isUrlFileInput(
  attachment: File | IUrlFileInput
): attachment is IUrlFileInput {
  return !(attachment instanceof File) && !!attachment.url
}

export async function uploadEmailAttachment(
  attachment: File | IUrlFileInput
): Promise<IFile> {
  const request = new Fetch().post('/emails/attachments')

  if (isUrlFileInput(attachment)) {
    request.send(attachment)
  }

  if (attachment instanceof File) {
    request.attach('file', attachment)
  }

  return (await request).body.data
}
