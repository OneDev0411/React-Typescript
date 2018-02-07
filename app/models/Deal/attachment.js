import Fetch from '../../services/fetch'

/**
 * delete attachment
 */
export async function deleteAttachment(roomId, files) {
  try {
    await new Fetch()
      .delete(`/rooms/${roomId}/attachments`)
      .query({ 'id[]': [files] })
  } catch (e) {
    throw e
  }
}

export default {
  deleteAttachment
}
