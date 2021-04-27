import Fetch from '../../../../services/fetch'

export async function reorderGallery(dealId, reorderObject) {
  try {
    await new Fetch()
      .put(`/deals/${dealId}/gallery/items/sort`)
      .send(reorderObject)
  } catch (e) {
    return []
  }
}
