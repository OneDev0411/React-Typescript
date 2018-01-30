import Fetch from '../../services/fetch'

/**
 * delete attachment
 */
export async function deleteAttachment(roomId, fileId) {
  try {
    await new Fetch().delete(`/rooms/${roomId}/attachments/${fileId}`)
  } catch (e) {
    throw e
  }
}

export default {
  deleteAttachment
}
