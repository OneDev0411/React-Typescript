import Fetch from 'services/fetch'

export async function deletePropertyType(
  brandId: UUID,
  propertyTypeId: UUID
): Promise<boolean> {
  try {
    await new Fetch().delete(
      `/brands/${brandId}/deals/property_types/${propertyTypeId}`
    )

    return true
  } catch (e) {
    console.log(e)

    return false
  }
}
