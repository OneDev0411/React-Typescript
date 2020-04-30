import Fetch from '../../../services/fetch'

export async function uploadMedia(
  dealId,
  file,
  fileName = null,
  order = 0,
  uploadProgressCallback = null
) {
  const result = await new Fetch({
    progress: uploadProgressCallback,
    useReferencedFormat: true
  })
    .upload(`/deals/${dealId}/gallery/items`)
    .attach('file', file, fileName)
    .field({ order })

  return result.body.data
}
