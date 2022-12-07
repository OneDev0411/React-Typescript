import Fetch from 'services/fetch'

export async function uploadAsset(
  templateId: UUID,
  file: File,
  shouldResize: boolean = false
): Promise<ITemplateAsset> {
  // We should resize the image through the proxy server
  // before send it to the API server
  if (shouldResize) {
    const response = await new Fetch()
      .post('/api/templates/assets/resize')
      .attach('attachment', file, file.name)
      .field('template', templateId)

    return response.body.data
  }

  // We can directly send the image to the API server
  const response = await new Fetch()
    .upload('/templates/assets')
    .attach('attachment', file, file.name)
    .field('template', templateId)

  return response.body.data
}
