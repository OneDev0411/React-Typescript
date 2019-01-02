import Fetch from '../../../../services/fetch'

export async function uploadTaskFile(
  taskId,
  file,
  fileName = null,
  uploadProgressCallback
) {
  try {
    return await new Fetch({
      progress: uploadProgressCallback
    })
      .upload(`/tasks/${taskId}/attachments`)
      .attach('file', file, fileName)
  } catch (e) {
    return null
  }
}
