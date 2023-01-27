import Fetch from '../../services/fetch'

type FilterOptions = 'template' | 'asset'
interface Options {
  mediums?: IMarketingTemplateMedium[]
  templateTypes?: IMarketingTemplateType[]
  filter?: FilterOptions
}

export async function getBrandMarketingCategories(
  brand: UUID,
  options?: Options
): Promise<IMarketingTemplateCategoryWithStats[]> {
  const query: {
    'types[]'?: IMarketingTemplateType[]
    'mediums[]'?: IMarketingTemplateMedium[]
    filter?: FilterOptions
  } = {}

  if (options?.templateTypes) {
    query['types[]'] = options.templateTypes
  }

  if (options?.mediums) {
    query['mediums[]'] = options.mediums
  }

  if (options?.filter) {
    query.filter = options.filter
  }

  const response = await new Fetch()
    .get(`/brands/${brand}/templates/categories`)
    .query(query)

  return response.body.data
}
