import Fetch from '../../../services/fetch'

export async function getMediaGallery(dealId) {
  try {
    const response = await new Fetch()
      .get(`/deals/${dealId}`)
      .query({ 'associations[]': ['deal.gallery'] })

    const files = response.body.references.file

    return Object.keys(files)
      .map(file => {
        return files[file]
      })
      .map(file => {
        return {
          file: file.id,
          src: file.preview_url,
          name: file.name
        }
      })
  } catch (e) {
    return []
  }
}
