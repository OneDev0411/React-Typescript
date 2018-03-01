import Fetch from '../../../services/fetch'

/**
 * Updating a contact (its attributes).
 * @param {object} file The uploaded file's object.
 * @param {string} fileName The the uploaded file's name.
 * @returns {object} Returns response body.
 */

export default async function uploadContactsAttachments({
  contactId,
  file,
  fileName = null
}) {
  if (file == null || !file.name) {
    throw new Error('File not found.')
  }

  const title = fileName || file.name

  try {
    const response = await new Fetch()
      .upload(`/contacts/${contactId}/attachments`)
      .attach('attachment', file, title)

    return response.body.data
  } catch (error) {
    throw error
  }
}
