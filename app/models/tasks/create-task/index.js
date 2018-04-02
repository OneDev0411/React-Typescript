import Fetch from '../../../services/fetch'

/**
 * Create a new task.
 * @param {object} task The new task data.
 * @returns {object} Returns new task.
 */

export async function createTask(task) {
  if (!task || Object.keys(task).length === 0) {
    throw new Error('New task has not any data.')
  }

  try {
    const response = await new Fetch().post('/crm/tasks').send(task)

    return response.body.data
  } catch (error) {
    throw error
  }
}
