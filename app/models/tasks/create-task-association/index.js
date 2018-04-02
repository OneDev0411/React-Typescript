import Fetch from '../../../services/fetch'

/**
 * Add a new association to a task.
 * @param {UUID} taskId The task id.
 * @param {object} associations The association.
 * @param {object|string} query The request query strings.
 * @returns {object} Returns new task.
 */
export async function createTaskAssociation(taskId, association, query = {}) {
  if (!taskId) {
    throw new Error('Task id is required.')
  }

  if (!association) {
    throw new Error('Association record is required.')
  }

  try {
    const response = await new Fetch()
      .post(`/crm/tasks/${taskId}/associations`)
      .send(association)
      .query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}
