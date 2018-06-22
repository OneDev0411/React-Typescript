import Fetch from '../../../services/fetch'

export async function importCsv(file_id, mappings) {
  try {
    const response = await new Fetch().post('/contacts/import.csv').send({
      file_id,
      mappings
    })

    return response.body && response.body.data
  } catch (error) {
    throw error
  }
}
