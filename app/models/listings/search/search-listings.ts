import Fetch from '../../../services/fetch'

export async function searchListings(
  text: string,
  query: string | object = {}
): Promise<ApiResponseBody<ICompactListing[]>> {
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
