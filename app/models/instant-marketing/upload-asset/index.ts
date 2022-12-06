import Fetch from 'services/fetch'

export async function uploadAsset(
  templateId: UUID,
  file: File,
  shouldResize: boolean = false
): Promise<ITemplateAsset> {
  const response = await new Fetch()
    .post('/api/templates/assets/upload')
    .attach('attachment', file, file.name)
    .field('template', templateId)
    .field('shouldResize', +shouldResize)

  return response.body.data
}
