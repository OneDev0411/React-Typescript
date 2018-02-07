import Fetch from '../../services/fetch'

/**
 * delete attachment
 */
export async function deleteAttachment(dealId, files) {
  try {
    await new Fetch().delete(`/deals/${dealId}/files`).query({ 'id[]': [files] })
  } catch (e) {
    throw e
  }
}

export default {
  deleteAttachment
}
