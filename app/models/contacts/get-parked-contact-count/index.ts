import Fetch from '../../../services/fetch'

export async function getParkedContactsCount(
  viewAsUser: UUID[] = []
): Promise<ApiResponseBody<any>> {
  try {
    const payload: any = {
      parked: true
    }

    if (viewAsUser.length > 0) {
      payload.users = viewAsUser
    }

    const response = await new Fetch()
      .get('/contacts')
      .query({ limit: 1 })
      .send(payload)

    return response.body?.info?.total
  } catch (error) {
    throw error
  }
}
