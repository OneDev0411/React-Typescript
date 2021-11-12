import Fetch from '../../services/fetch'

interface OptionsWithLabel {
  label?: string
}

interface OptionsWithTemplateTypeAndMedium extends OptionsWithLabel {
  template_type: IMarketingTemplateType
  medium: IMarketingTemplateMedium
}

export async function uploadBrandAsset(
  brand: UUID,
  file: File,
  options: OptionsWithLabel | OptionsWithTemplateTypeAndMedium = {}
): Promise<IBrandAsset> {
  const request = new Fetch()
    .upload(`/brands/${brand}/assets`)
    .attach('file', file)
    .field(options as any)

  const response = await request

  return response.body.data
}
