import Fetch from 'services/fetch'

export async function getDealStatuses(dealId: UUID): Promise<IDealStatus[]> {
  try {
    const response = await new Fetch().get(`/deals/${dealId}/statuses`)

    return response.body.data
  } catch (e) {
    console.log(e)
    throw e
  }
}
