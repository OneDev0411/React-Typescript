import Fetch from '../../../services/fetch'

export async function importCsv(file_id, owner, mappings) {
  try {
    const response = await new Fetch().post('/contacts/import.csv').send({
      file_id,
      owner,
      mappings
    })

    return response.body && response.body.data
  } catch (error) {
    throw error
  }
}
