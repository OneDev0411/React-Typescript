import Fetch from '../../../services/fetch'

export async function getTriggers(
  brandId: UUID
): Promise<ApiResponseBody<IGlobalTrigger[]>> {
  try {
    const response = await new Fetch().get(`/brands/${brandId}/triggers`)

    return response.body
  } catch (e) {
    throw e
  }
}
