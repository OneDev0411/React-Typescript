import Fetch from '../../../../services/fetch'

export async function createTaskFile(taskId, file) {
  try {
    return await new Fetch().post(`/tasks/${taskId}/attachments`).send(file)
  } catch (e) {
    throw e
  }
}
