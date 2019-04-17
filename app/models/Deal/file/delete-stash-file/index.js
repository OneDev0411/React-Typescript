import Fetch from '../../../../services/fetch'

/**
 * delete files from a deal
 */
export async function deleteStashFile(dealId, fileId) {
  try {
    await new Fetch().delete(`/deals/${dealId}/files/${fileId}`)
  } catch (e) {
    throw e
  }
}
