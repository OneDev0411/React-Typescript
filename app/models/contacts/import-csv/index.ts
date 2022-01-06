import Fetch from '../../../services/fetch'

export async function importCsv(
  fileId: UUID,
  owner: UUID,
  mappings: Record<string, unknown>
) {
  try {
    const response = await new Fetch().post('/contacts/import.csv').send({
      file_id: fileId,
      owner,
      mappings
    })

    return response.body.data
  } catch (error) {
    throw error
  }
}
