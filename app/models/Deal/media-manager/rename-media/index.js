import Fetch from '../../../../services/fetch'

export async function renameMedia(dealId, mediaId, name) {
  try {
    const response = await new Fetch()
      .put(`/deals/${dealId}/gallery/items/${mediaId}`)
      .send({ name })

    return response.body.data.name
  } catch (e) {
    throw e
  }
}
