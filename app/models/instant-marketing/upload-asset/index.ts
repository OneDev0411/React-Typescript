import Fetch from 'services/fetch'

export default async function uploadAsset(
  file: File,
  templateId: UUID
): Promise<ITemplateAsset> {
  const response = await new Fetch()
    .upload('/templates/assets')
    .attach('attachment', file, file.name)
    .field('template', templateId)

  return response.body.data
}
