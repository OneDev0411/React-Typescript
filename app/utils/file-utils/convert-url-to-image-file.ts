import { parseImageMimeType } from './get-file-type'

export async function convertUrlToImageFile(url: string): Promise<File> {
  const response = await fetch(url)

  const contentType = response.headers.get('content-type')!
  const ext = parseImageMimeType(contentType)
  const bufferData = await response.arrayBuffer()

  return new File([bufferData], `image.${ext}`, { type: contentType })
}
