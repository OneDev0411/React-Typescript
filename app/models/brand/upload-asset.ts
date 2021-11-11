import Fetch from '../../services/fetch'

export async function uploadBrandAsset(
  brand: UUID,
  file: File,
  options: {
    label?: string
    templateType?: IMarketingTemplateType
  } = {}
): Promise<IBrandAsset> {
  const request = new Fetch()
    .upload(`/brands/${brand}/assets`)
    .attach('file', file)
    .field(options)

  const response = await request

  return response.body.data
}
