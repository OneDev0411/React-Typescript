import Fetch from '../../../services/fetch'

/**
 * Delete a association from a task.
 * @param {UUID} taskId The task id.
 * @param {UUID} associations The associationId.
 * @param {object|string} query The request query strings.
 * @returns {object} Returns nothing.
 */
export async function deleteTaskAssociation(taskId, associationId, query = {}) {
  if (!taskId) {
    throw new Error('Task id is required.')
  }

  if (!associationId) {
    throw new Error('Association id is required.')
  }

  try {
    const response = await new Fetch()
      .delete(`/crm/tasks/${taskId}/associations/${associationId}`)
      .query(query)

    return response
  } catch (error) {
    throw error
  }
}
