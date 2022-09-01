import Fetch from '../../services/fetch'

interface Options {
  mediums?: IMarketingTemplateMedium[]
  templateTypes?: IMarketingTemplateType[]
}

export async function getBrandMarketingCategories(
  brand: UUID,
  options?: Options
): Promise<IMarketingTemplateCategories> {
  const query: {
    'types[]'?: IMarketingTemplateType[]
    'mediums[]'?: IMarketingTemplateMedium[]
  } = {}

  if (options?.templateTypes) {
    query['types[]'] = options.templateTypes
  }

  if (options?.mediums) {
    query['mediums[]'] = options.mediums
  }

  const response = await new Fetch()
    .get(`/brands/${brand}/templates/categories`)
    .query(query)

  return response.body.data
}
