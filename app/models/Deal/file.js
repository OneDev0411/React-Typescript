import Fetch from '../../services/fetch'

export async function uploadStashFile(
  dealId,
  file,
  fileName = null,
  uploadProgressCallback
) {
  try {
    return await new Fetch({
      progress: uploadProgressCallback
    })
      .upload(`/deals/${dealId}/files`)
      .attach('file', file, fileName)
  } catch (e) {
    return null
  }
}

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

export async function createTaskFile(taskId, file) {
  try {
    return await new Fetch().post(`/tasks/${taskId}/attachments`).send(file)
  } catch (e) {
    throw e
  }
}

export async function createDealFile(dealId, file) {
  try {
    return await new Fetch().post(`/deals/${dealId}/files`).send(file)
  } catch (e) {
    throw e
  }
}

/**
 * delete files from a deal
 */
export async function deleteFiles(dealId, files) {
  try {
    await new Fetch()
      .delete(`/deals/${dealId}/files`)
      .query({ 'id[]': [files] })
  } catch (e) {
    throw e
  }
}

export default {
  uploadStashFile,
  uploadTaskFile,
  deleteFiles,
  createTaskFile,
  createDealFile
}
