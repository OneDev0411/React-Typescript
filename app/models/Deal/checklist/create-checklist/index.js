import Fetch from '../../../../services/fetch'

/**
 * create a new checklist
 */
export async function createChecklist(deal_id, data) {
  try {
    const response = await new Fetch()
      .post(`/deals/${deal_id}/checklists`)
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}
