import Fetch from '../../../../services/fetch'

export async function createDealFile(dealId, file) {
  try {
    return await new Fetch().post(`/deals/${dealId}/files`).send(file)
  } catch (e) {
    throw e
  }
}
