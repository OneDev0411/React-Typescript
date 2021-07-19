import Fetch from '../../../../services/fetch'

export async function deleteMedias(dealId, mediaIds) {
  try {
    await new Fetch()
      .delete(`/deals/${dealId}/gallery/items`)
      .send({ items: mediaIds })

    return true
  } catch (e) {
    return []
  }
}
