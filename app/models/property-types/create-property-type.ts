import Fetch from 'services/fetch'

export interface PropertyTypeData {
  label: string
  is_lease: boolean
}

export async function createPropertyType(
  brandId: UUID,
  data: PropertyTypeData
): Promise<IDealPropertyType> {
  const response = await new Fetch()
    .post(`/brands/${brandId}/deals/property_types`)
    .send(data)

  return response.body.data
}
