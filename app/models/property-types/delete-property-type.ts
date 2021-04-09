import Fetch from 'services/fetch'

export async function deletePropertyType(
  brandId: UUID,
  propertyTypeId: UUID
): Promise<void> {
  const response = await new Fetch().delete(
    `/brands/${brandId}/deals/property_types/${propertyTypeId}`
  )

  return response.body.data
}
