import Fetch from '../../services/fetch'

/**
 * update checklist
 */
export async function updateChecklist(deal_id, checklist_id, attributes) {
  try {
    const response = await new Fetch()
      .put(`/deals/${deal_id}/checklists/${checklist_id}`)
      .send(attributes)

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default {
  updateChecklist
}
