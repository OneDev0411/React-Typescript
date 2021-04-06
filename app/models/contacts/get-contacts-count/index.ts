import Fetch from '../../../services/fetch'

export async function getContactsCount(
  viewAsUser: UUID[] = [],
  justParked: boolean = true
): Promise<ApiResponseBody<any>> {
  try {
    console.log('getContactsCount')

    const response = await new Fetch()
      .get('/contacts')
      .query({ limit: 1 })
      .send({
        parked: justParked,
        users: viewAsUser.length > 0 ? viewAsUser : undefined
      })

    return response.body?.info?.total
  } catch (error) {
    throw error
  }
}
