import Fetch from '../../services/fetch'

interface Options {
  templateTypes?: IMarketingTemplateType[]
  mediums?: IMarketingTemplateMedium[]
}

export async function getBrandAssets(
  brand: UUID,
  options?: Options
): Promise<IBrandAsset[]> {
  const query: {
    'template_types[]'?: IMarketingTemplateType[]
    'mediums[]'?: IMarketingTemplateMedium[]
  } = {}

  if (options?.templateTypes) {
    query['template_types[]'] = options.templateTypes
  }

  if (options?.mediums) {
    query['mediums[]'] = options.mediums
  }

  const response = await new Fetch().get(`/brands/${brand}/assets`).query(query)

  const allAssets: IBrandAsset[] = response.body.data

  return allAssets.filter(
    asset => asset.label || asset.medium || asset.template_type
  )
}
