import Fetch from 'services/fetch'

export interface PropertyTypeData {
  label: string
  is_lease: boolean
  required_roles: string[]
  optional_roles: string[]
}

export async function updatePropertyType(
  id: UUID,
  brandId: UUID,
  data: PropertyTypeData
): Promise<IDealPropertyType> {
  const response = await new Fetch()
    .put(`/brands/${brandId}/deals/property_types/${id}`)
    .send(data)

  return response.body.data
}
