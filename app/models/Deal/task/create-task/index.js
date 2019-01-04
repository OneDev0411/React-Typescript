import Fetch from '../../../../services/fetch'

/**
 * create new task
 */
export async function createTask(dealId, data) {
  try {
    const response = await new Fetch()
      .post(`/deals/${dealId}/tasks`)
      .send(data)
      .send({ is_deletable: true })

    return response.body.data
  } catch (e) {
    throw e
  }
}
