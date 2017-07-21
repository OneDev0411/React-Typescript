import Fetch from '../../../services/fetch'

const byValert = async (options, widgetOptions) => {
  if (!options) {
    return
  }
  let endpoint = '/valerts'
  if (widgetOptions) {
    endpoint += widgetOptions.queryString
  }
  try {
    const response = await new Fetch()
      .post(endpoint)
      .send(options)

    return response.body
  } catch (error) {
    throw error
  }
}
export default byValert