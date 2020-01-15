import Fetch from '../../../services/fetch'

export async function uploadFile(
  dealId,
  file,
  fileName = null,
  uploadProgressCallback
) {
  try {
    return await new Fetch({
      progress: uploadProgressCallback
    })
      .upload(`/deals/${dealId}/gallery/attach`)
      .attach('file', file, fileName)
  } catch (e) {
    return null
  }
}
