import Fetch from '../../../../services/fetch'

/**
 * get forms list
 */
export async function getForms(dealId: UUID): Promise<IBrandForm[]> {
  try {
    const response = await new Fetch().get(`/deals/${dealId}/forms`).query({
      'associations[]': ['form.library']
    })

    return response.body.data
  } catch (e) {
    console.log(e)

    return []
  }
}
