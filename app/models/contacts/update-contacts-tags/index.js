import Fetch from '../../../services/fetch'

export async function updateContactsTags(oldTag, newTag, touchDate = null) {
  try {
    const response = await new Fetch()
      .patch(`/contacts/tags/${encodeURIComponent(oldTag)}`)
      .send({ tag: newTag, touch_freq: touchDate })

    return response.body
  } catch (error) {
    throw error
  }
}
