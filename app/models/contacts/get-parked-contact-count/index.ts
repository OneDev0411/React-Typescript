import Fetch from '../../../services/fetch'

export async function getParkedContactsCount(
  viewAsUser: UUID[] = []
): Promise<ApiResponseBody<any>> {
  try {
    const response = await new Fetch()
      .get('/contacts')
      .query({ limit: 1 })
      .send({
        parked: true,
        users: viewAsUser.length > 0 ? viewAsUser : undefined
      })

    return response.body?.info?.total
  } catch (error) {
    throw error
  }
}
