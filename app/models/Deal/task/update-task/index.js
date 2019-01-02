import Fetch from '../../../../services/fetch'

/**
 * delete task
 */
export async function updateTask(taskId, attributes) {
  try {
    const response = await new Fetch()
      .patch(`/tasks/${taskId}?associations[]=room.attachments`)
      .send(attributes)

    return response.body.data
  } catch (e) {
    throw e
  }
}
