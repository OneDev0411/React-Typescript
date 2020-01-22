import Fetch from '../../../services/fetch'

export async function uploadCroppedMedia(
  dealId,
  fileId,
  fileObject,
  fileName = null,
  uploadProgressCallback
) {
  try {
    const result = await new Fetch({
      progress: uploadProgressCallback,
      useReferencedFormat: true
    })
      .patch(`/deals/${dealId}/gallery/items/${fileId}/file`)
      .attach('file', fileObject, fileName)

    console.log(result)

    return result
  } catch (e) {
    return null
  }
}
