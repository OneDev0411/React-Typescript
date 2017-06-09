import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

const prepareListignsForMap = listings =>
  listings.map(list => ({
    ...list,
    list,
    lat: list.location.latitude,
    lng: list.location.longitude
  }))


export const fetchListings = async (options) => {
  if (!options) {
    return
  }

  try {
    const response = await new Fetch()
      .post('/valerts')
      .send(options)

    const { code, info, data } = response.body
    const listings = prepareListignsForMap(data)
    const normilizedListings = normalize(listings, schema.listingsList)
    return {
      ...normilizedListings,
      status: {
        code,
        ...info
      }
    }
  } catch (error) {
    throw error
  }
}