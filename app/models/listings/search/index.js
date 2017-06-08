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

    const listings = prepareListignsForMap(response.body.data)
    return normalize(listings, schema.listingsList)
  } catch (error) {
    throw error
  }
}