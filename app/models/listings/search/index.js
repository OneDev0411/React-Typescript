import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'


export const fetchListings = async ({ options, office, offset }) => {
  if (!options) {
    return
  }

  try {
    const response = await new Fetch()
      .get('/valerts')

    return normalize(response.body.data, schema.listingsList)
  } catch (error) {
    throw error
  }
}