import Fetch from '../../../../services/fetch'

export async function uploadStashFile(
  dealId,
  file,
  fileName = null,
  uploadProgressCallback
) {
  try {
    return await new Fetch({
      progress: uploadProgressCallback
    })
      .upload(`/deals/${dealId}/files`)
      .attach('file', file, fileName)
  } catch (e) {
    return null
  }
}
