import Fetch from '../../../services/fetch'

export async function uploadCsvFile(file) {
  try {
    const response = await new Fetch({ stream: true })
      .upload('/contacts/upload')
      .attach('attachment', file, file.name)

    return response.body && response.body.data
  } catch (error) {
    throw error
  }
}
