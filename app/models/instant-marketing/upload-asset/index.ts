import Fetch from 'services/fetch'

export async function uploadAsset(
  templateId: UUID,
  file: File
): Promise<ITemplateAsset> {
  const response = await new Fetch()
    .post('/api/templates/assets/upload')
    .attach('attachment', file, file.name)
    .field('template', templateId)

  return response.body.data
}
