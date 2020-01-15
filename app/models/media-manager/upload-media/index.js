import Fetch from '../../../services/fetch'

export async function uploadMedia(
  dealId,
  file,
  fileName = null,
  uploadProgressCallback
) {
  try {
    return await new Fetch({
      progress: uploadProgressCallback
    })
      .upload(`/deals/${dealId}/gallery/items`)
      .attach('file', file, fileName)
  } catch (e) {
    return null
  }
}
