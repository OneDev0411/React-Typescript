import Fetch from '../../../../services/fetch'

/**
 * set notify office flag
 */
export async function needsAttention(deal_id, task_id, status) {
  try {
    const response = await new Fetch().put(`/deals/${deal_id}/tasks`).send([
      {
        id: task_id,
        attention_requested: status
      }
    ])

    return response.body.data
  } catch (e) {
    return false
  }
}
