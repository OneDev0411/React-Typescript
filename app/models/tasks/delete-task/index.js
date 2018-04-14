import Fetch from '../../../services/fetch'

/**
 * Deleting a task.
 * @param {UUID} taskId The task id.
 * @returns {object} Returns response - actually nothing. it returns 204.
 */

export async function deleteTask(taskId) {
  if (!taskId) {
    throw new Error('task id is required.')
  }

  try {
    return await new Fetch().delete(`/crm/tasks/${taskId}`)
  } catch (error) {
    throw error
  }
}
