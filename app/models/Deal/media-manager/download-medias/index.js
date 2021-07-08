import Fetch from '../../../../services/fetch'

export async function downloadMedias(dealId, mediaIds) {
  try {
    const response = await new Fetch({ useReferencedFormat: false })
      .post(`/deals/${dealId}/gallery.zip`)
      .send({ items: mediaIds })

    return response.body.info.url
  } catch (e) {
    return []
  }
}
