import Fetch from '../../../services/fetch'

/**
 * Update a task status.
 * @param {object} taskId task id.
 * @param {string} query new task status.
 */
export async function updateTaskStatus(taskId, status = 'PENDING') {
  if (!taskId) {
    throw new Error('Task id is required.')
  }

  try {
    const response = await new Fetch()
      .patch(`/crm/tasks/${taskId}/status`)
      .query({
        'associations[]': ['crm_task.associations', 'crm_association.contact']
      })
      .send({ status })

    return response.body.data
  } catch (error) {
    throw error
  }
}
