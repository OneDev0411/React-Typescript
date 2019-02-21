import Fetch from '../../../services/fetch'

export async function deleteContactsTags(tag) {
  try {
    const response = await new Fetch().delete(
      `/contacts/tags/${encodeURIComponent(tag)}`
    )

    return response.body
  } catch (error) {
    throw error
  }
}
