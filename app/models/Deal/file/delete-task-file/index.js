import Fetch from '../../../../services/fetch'

/**
 * delete files from a deal
 */
export async function deleteTaskFile(taskId, fileId) {
  try {
    await new Fetch().delete(`/tasks/${taskId}/files/${fileId}`)
  } catch (e) {
    throw e
  }
}
