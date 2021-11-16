import Fetch from '../../services/fetch'

interface OptionsWithLabel {
  label?: string
}

interface OptionsWithTemplateTypeAndMedium extends OptionsWithLabel {
  template_type: IMarketingTemplateType
  medium: IMarketingTemplateMedium
}

export async function uploadBrandAsset(
  brands: UUID[],
  file: File,
  options: OptionsWithLabel | OptionsWithTemplateTypeAndMedium = {}
): Promise<IBrandAsset> {
  const request = new Fetch()
    .upload('/brands/assets')
    .attach('file', file)
    .field({ ...options, brands } as any)

  const response = await request

  return response.body.data
}
