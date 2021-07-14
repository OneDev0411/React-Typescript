import Fetch from '@app/services/fetch'

export async function getBrandStatuses(brandId: UUID): Promise<IDealStatus[]> {
  try {
    const response = await new Fetch().get(`/brands/${brandId}/deals/statuses`)

    return response.body.data
  } catch (e) {
    console.log(e)

    return []
  }
}

export async function updateBrandStatus(
  brandId: UUID,
  statusId: UUID,
  data: Record<string, unknown>
): Promise<void> {
  try {
    await new Fetch()
      .put(`/brands/${brandId}/deals/statuses/${statusId}`)
      .send(data)
  } catch (e) {
    throw e
  }
}
