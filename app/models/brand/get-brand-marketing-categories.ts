import Fetch from '../../services/fetch'

export async function getBrandMarketingCategories(
  brand: UUID
): Promise<IMarketingCategories[]> {
  const response = await new Fetch().get(
    `/brands/${brand}/templates/categories`
  )

  return response.body.data
}
