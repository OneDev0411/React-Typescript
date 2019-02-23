import Fetch from '../../../services/fetch'

export async function updateContactsTags(oldTag, newTag) {
  try {
    const response = await new Fetch()
      .patch(`/contacts/tags/${encodeURIComponent(oldTag)}`)
      .send({ tag: newTag })

    return response.body
  } catch (error) {
    throw error
  }
}
