import Fetch from '../../../services/fetch'

export async function editMedia(dealId, mediaId, name) {
  try {
    const response = await new Fetch()
      .put(`/deals/${dealId}/gallery/items/${mediaId}`)
      .send({ name })
  } catch (e) {
    return []
  }
}
