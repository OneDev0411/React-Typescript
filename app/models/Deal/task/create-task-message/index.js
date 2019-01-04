import Fetch from '../../../../services/fetch'

/**
 * create new task
 */
export async function createTaskMessage(taskId, message) {
  try {
    const response = await new Fetch()
      .post(`/tasks/${taskId}/messages`)
      .send(message)

    return response.body.data
  } catch (e) {
    throw e
  }
}
