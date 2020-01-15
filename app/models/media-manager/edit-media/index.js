import Fetch from '../../../services/fetch'

export async function editMedia(dealId, mediaId) {
  try {
    const response = await new Fetch().put(
      `/deals/${dealId}/gallery/items/${mediaId}`
    )

    console.log(response)
    // const files = response.body

    // return Object.keys(files)
    //   .map(file => {
    //     return files[file]
    //   })
    //   .map(file => {
    //     return {
    //       file: file.id,
    //       src: file.preview_url,
    //       name: file.name
    //     }
    //   })
  } catch (e) {
    return []
  }
}
