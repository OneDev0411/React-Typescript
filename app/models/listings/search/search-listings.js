import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

export const searchListings = async (text, query, hasNeedNormalized = true) => {
  if (typeof text !== 'string') {
    throw new Error('The query param should be a string!')
  }

  try {
    const response = await new Fetch()
      .get('/listings/search')
      .query({ q: text })
      .query(query)

    if (!hasNeedNormalized) {
      return response.body
    }

    const { code, info, data } = response.body

    const normilizedListings = normalize(data, schema.listingsList)

    return {
      ...normilizedListings,
      info: {
        code,
        ...info
      }
    }
  } catch (error) {
    throw error
  }
}
