import Fetch from '../../../services/fetch'

/**
 * Get a task.
 * @param {UUID} taskId The task id.
 * @param {object|string} query The request query strings.
 * @returns {object} Returns a task.
 */
export async function getTask(taskId, query = {}) {
  if (!taskId) {
    throw new Error('Task id is required.')
  }

  try {
    const response = await new Fetch().get(`/crm/tasks/${taskId}`).query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}
