import Fetch from '../../../services/fetch'

/**
 * Deleting a task.
 * @param {UUID} taskId The task id.
 * @returns {object} Returns response - actually nothing. it returns 204.
 */

export async function deleteTask(taskId, shouldNotify = false) {
  if (!taskId) {
    throw new Error('task id is required.')
  }

  try {
    return await new Fetch().delete(`/crm/tasks/${taskId}`).send({
      metadata: {
        send_updates: shouldNotify
      }
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}
