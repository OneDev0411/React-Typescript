import Fetch from '../../../services/fetch'

export async function getParkedContactsCount(): Promise<ApiResponseBody<any>> {
  try {
    const response = await new Fetch().get('/contacts').query({
      parked: true,
      limit: 1
    })

    return response.body?.info?.total
  } catch (error) {
    throw error
  }
}
