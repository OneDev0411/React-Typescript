import Fetch from '../../../services/fetch'

const byValert = async (options, widgetOptions = {}, brand) => {
  if (!options) {
    return
  }

  let endpoint = '/valerts'

  try {
    const request = new Fetch()
      .post(endpoint)
      .send(options)
      .query({
        associations: 'compact_listing.proposed_agent',
        ...widgetOptions
      })

    if (brand && brand.id) {
      request.set('X-RECHAT-BRAND', brand.id)
    }

    const response = await request

    return response.body
  } catch (error) {
    throw error
  }
}
export default byValert
