import Fetch from 'services/fetch'

export async function getBrandStatuses(brandId: UUID): Promise<IDealStatus[]> {
  try {
    const response = await new Fetch().get(`/brands/${brandId}/deals/statuses`)

    return response.body.data
  } catch (e) {
    console.log(e)
    throw e
  }
}
