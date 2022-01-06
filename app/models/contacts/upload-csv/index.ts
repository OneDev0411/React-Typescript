import Fetch from '../../../services/fetch'

export async function uploadCsvFile(file: File) {
  try {
    const response = await new Fetch()
      .upload('/contacts/upload')
      .attach('attachment', file, file.name)

    return response.body.data
  } catch (error) {
    throw error
  }
}
