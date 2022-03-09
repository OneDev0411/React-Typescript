import Fetch from '@app/services/fetch'

export async function exportDeal(deal: IDeal) {
  try {
    const response = await new Fetch()
      .get(`/deals/${deal.id}.zip`)
      .responseType('blob')

    return response.body
  } catch (e) {
    throw e
  }
}
