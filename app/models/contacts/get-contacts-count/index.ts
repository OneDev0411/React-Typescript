import Fetch from '../../../services/fetch'

export async function getContactsCount(
  viewAsUser: UUID[] = [],
  justParked: boolean = true
): Promise<ApiResponseBody<any>> {
  try {
    const payload: any = {
      parked: justParked
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
