import Fetch from '../../../../services/fetch'

/**
 * rename files from a deal
 */
export async function renameTaskFile(taskId, fileId, filename) {
  try {
    await new Fetch().post(`/tasks/${taskId}/files/${fileId}/rename`).send({
      filename
    })
  } catch (e) {
    throw e
  }
}
