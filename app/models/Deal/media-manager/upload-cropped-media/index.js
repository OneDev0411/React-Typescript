import Fetch from '../../../../services/fetch'

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
      .upload(`/deals/${dealId}/gallery/items/${fileId}/file`, 'patch')
      .attach('file', fileObject, fileName)

    return result.body.data.file
  } catch (error) {
    throw error
  }
}
