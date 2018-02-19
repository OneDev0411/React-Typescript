import Fetch from '../../../services/fetch'

/**
 * Updating a contact (its attributes).
 * @param {object} file The uploaded file's object.
 * @param {string} fileName The the uploaded file's name.
 * @returns {object} Returns response body.
 */

export default async function uploadContacts({ file, fileName = null }) {
  if (file == null || !file.name) {
    throw new Error('File not found.')
  }

  const title = fileName || file.name

  try {
    const response = await new Fetch()
      .upload('/contacts/outlook.csv')
      .attach('attachment', file, title)

    return response.body
  } catch (error) {
    throw error
  }
}
