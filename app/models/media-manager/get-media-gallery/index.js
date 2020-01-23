import Fetch from '../../../services/fetch'

export async function getMediaGallery(dealId) {
  try {
    const response = await new Fetch({ useReferencedFormat: false })
      .get(`/deals/${dealId}`)
      .query({ 'associations[]': ['deal.gallery'] })

    const rawGalleryItems = response.body.data.gallery.items

    return rawGalleryItems.map(item => {
      return {
        file: item.id,
        src: item.file.preview_url,
        name: item.name,
        order: item.order,
        selected: false
      }
    })
  } catch (e) {
    return []
  }
}
