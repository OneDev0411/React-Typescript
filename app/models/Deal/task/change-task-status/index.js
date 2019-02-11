import Fetch from '../../../../services/fetch'

/**
 * change task status
 */
export async function changeTaskStatus(task_id, status) {
  try {
    await new Fetch().put(`/tasks/${task_id}/review`).send({ status })
  } catch (e) {
    return false
  }
}
