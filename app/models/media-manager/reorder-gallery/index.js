import Fetch from '../../../services/fetch'

export async function reorderGallery(dealId, reorderObject) {
  try {
    const response = await new Fetch()
      .put(`/deals/${dealId}/gallery/items/sort`)
      .send(reorderObject)

    console.log(response)
  } catch (e) {
    return []
  }
}
