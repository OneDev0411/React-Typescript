import Fetch from '../../../../services/fetch'

/**
 * get forms list
 */
export async function getForms(dealId) {
  try {
    const response = await new Fetch().get(`/deals/${dealId}/forms`)

    return response.body.data
  } catch (e) {
    console.log(e)
  }
}
