import Fetch from '../../services/fetch'

export async function getBrandPropertyTypes(
  brandId: UUID
): Promise<IDealPropertyType[]> {
  try {
    const response = await new Fetch().get(
      `/brands/${brandId}/deals/property_types`
    )

    return response.body.data
  } catch (e) {
    throw e
  }
}
