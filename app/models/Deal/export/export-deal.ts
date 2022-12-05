import Fetch from '@app/services/fetch'

export async function exportDeal(deal: IDeal) {
  try {
    const response = await new Fetch().get(`/deals/${deal.id}.zip`)

    return response.body.data
  } catch (e) {
    throw e
  }
}
