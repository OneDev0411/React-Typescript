import Fetch from '../../../../services/fetch'

/**
 * delete task
 */
export async function deleteTask(taskId) {
  try {
    const response = await new Fetch().delete(`/tasks/${taskId}`)

    return response.body && response.body.data
  } catch (e) {
    throw e
  }
}
