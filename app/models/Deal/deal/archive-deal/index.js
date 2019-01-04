import Fetch from '../../../../services/fetch'

/**
 * archive a deal
 */
export async function archiveDeal(dealId) {
  try {
    await new Fetch().delete(`/deals/${dealId}`)
  } catch (e) {
    throw e
  }
}
