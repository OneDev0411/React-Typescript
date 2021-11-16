import Fetch from '../../services/fetch'

interface Options {
  templateTypes?: IMarketingTemplateType[]
  medium?: IMarketingTemplateMedium
}

export async function getBrandAssets(
  brand: UUID,
  options?: Options
): Promise<IBrandAsset[]> {
  const query: {
    'template_types[]'?: IMarketingTemplateType[]
    medium?: IMarketingTemplateMedium
  } = {}

  if (options?.templateTypes) {
    query['template_types[]'] = options.templateTypes
  }

  if (options?.medium) {
    query.medium = options.medium
  }

  const response = await new Fetch()
    .get(`/brands/${brand}/assets`)
    .query(query ?? {})

  const allAssets: IBrandAsset[] = response.body.data

  return allAssets.filter(asset => !!asset.label)
}
