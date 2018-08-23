import Fetch from '../../../services/fetch'

export async function getImportCsvWorkerState(id) {
  try {
    const response = await new Fetch().get(`/contacts/jobs/${id}`)

    return response.body && response.body.data
  } catch (error) {
    throw error
  }
}
