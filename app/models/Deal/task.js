import Fetch from '../../services/fetch'

/**
 * create new task
 */
export async function createTaskMessage(taskId, message) {
  try {
    const response = await new Fetch()
      .post(`/tasks/${taskId}/messages`)
      .send(message)

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * create new task
 */
export async function createTask(dealId, data) {
  try {
    const response = await new Fetch()
      .post(`/deals/${dealId}/tasks`)
      .send(data)
      .send({ is_deletable: true })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * delete task
 */
export async function deleteTask(taskId) {
  try {
    const response = await new Fetch().delete(`/tasks/${taskId}`)

    return response.body.data
  } catch (e) {
    throw e
  }
}

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

/**
 * set notify office flag
 */
export async function needsAttention(deal_id, task_id, status) {
  return bulkSubmit(deal_id, [
    {
      id: task_id,
      attention_requested: status
    }
  ])
}

/**
 * bulk submit for review
 */
export async function bulkSubmit(dealId, tasks) {
  try {
    const response = await new Fetch().put(`/deals/${dealId}/tasks`).send(tasks)

    return response.body.data
  } catch (e) {
    return false
  }
}

export default {
  createTaskMessage,
  createTask,
  deleteTask,
  updateTask,
  changeTaskStatus,
  needsAttention,
  bulkSubmit
}
