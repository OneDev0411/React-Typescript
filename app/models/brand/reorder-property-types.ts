import Fetch from '../../services/fetch'

export async function reorderBrandPropertyTypes(
  brandId: UUID,
  data: {
    id: UUID
    order: number
  }[]
): Promise<void> {
  try {
    await new Fetch()
      .put(`/brands/${brandId}/deals/property_types/sort`)
      .send(data)
  } catch (e) {
    throw e
  }
}
