import Fetch from '../../../services/fetch'

export async function uploadMedia(
  dealId,
  file,
  fileName = null,
  uploadProgressCallback
) {
  try {
    const result = await new Fetch({
      progress: uploadProgressCallback,
      useReferencedFormat: true
    })
      .upload(`/deals/${dealId}/gallery/items`)
      .attach('file', file, fileName)

    return result.body.data
  } catch (error) {
    throw error
  }
}
