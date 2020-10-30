export async function convertUrlToImageFile(url: string): Promise<File> {
  const response = await fetch(url)
  const bufferData = await response.arrayBuffer()

  return new File([bufferData], 'image.jpg', { type: 'image/jpeg' })
}
