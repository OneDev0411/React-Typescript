import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

const prepareListignsForMap = listings =>
  listings.map((listing) => {
    let lat
    let lng

    if (listing.location) {
      lat = listing.location.latitude
      lng = listing.location.longitude
    }

    if (listing.property && listing.property.address) {
      lat = listing.property.address.location.latitude
      lng = listing.property.address.location.longitude
    }

    if (lat && lng) {
      return {
        ...listing,
        numPoints: 1,
        list: { ...listing },
        lat,
        lng
      }
    }
  })


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