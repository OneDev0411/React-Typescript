import Fetch from '../../../services/fetch'

export async function uploadMedia(
  dealId,
  fileObject,
  fileName = null,
  order = 0,
  uploadProgressCallback = null
) {
  const result = await new Fetch({
    progress: uploadProgressCallback,
    useReferencedFormat: true
  })
    .upload(`/deals/${dealId}/gallery/items`)
    .attach('file', fileObject, fileName)
    .field({ order })

  return result.body.data
}
