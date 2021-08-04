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

export async function createBrandStatus(
  brandId: UUID,
  data: Record<string, unknown>
): Promise<IDealStatus> {
  try {
    const response = await new Fetch()
      .post(`/brands/${brandId}/deals/statuses`)
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}

export async function deleteBrandStatus(
  brandId: UUID,
  statusId: UUID
): Promise<void> {
  try {
    await new Fetch().delete(`/brands/${brandId}/deals/statuses/${statusId}`)
  } catch (e) {
    throw e
  }
}
