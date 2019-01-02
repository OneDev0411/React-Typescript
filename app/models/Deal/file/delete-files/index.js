import Fetch from '../../../../services/fetch'

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
