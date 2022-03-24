import Fetch from '@app/services/fetch'
import { Progress } from '@app/services/fetch/types'

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
  options: OptionsWithLabel | OptionsWithTemplateTypeAndMedium = {},
  progressCallback?: Progress
): Promise<IBrandAsset[]> {
  const request = new Fetch({ progress: progressCallback })
    .upload('/brands/assets')
    .attach('file', file)
    .field({ ...options, brands: brands.join(',') })

  const response = await request

  return response.body.data
}
