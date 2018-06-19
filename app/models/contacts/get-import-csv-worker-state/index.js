import Fetch from '../../../services/fetch'

export async function getImportCsvWorkerState(id) {
  try {
    const response = await new Fetch().get(`/contacts/import/${id}/status`)

    return response.body && response.body.data
  } catch (error) {
    throw error
  }
}
