import Fetch from '../../../services/fetch'

export const searchListings = async (text, query) => {
  if (typeof text !== 'string') {
    throw new Error('The text param should be a string!')
  }

  try {
    const response = await new Fetch()
      .get('/listings/search')
      .query({ q: text })
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
