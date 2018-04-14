import Fetch from '../../../services/fetch'

/**
 * Fetch all associations of a task.
 * @param {UUID} taskId The task id.
 * @param {object|string} query The request query strings.
 * @returns {array} Returns associations.
 */
export async function getTaskAssociations(taskId, query = {}) {
  if (!taskId) {
    throw new Error('Task id is required.')
  }

  try {
    const response = await new Fetch()
      .get(`/crm/tasks/${taskId}/associations`)
      .query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}
