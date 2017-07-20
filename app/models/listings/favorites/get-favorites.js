import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

const getFavorateListingsData = favorites =>
  favorites.map(favorite => {
    const { listing, id: recId, room: recRoom } = favorite
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
        lat,
        lng,
        recId,
        recRoom
      }
    }
  })

const getFavorites = async (user = {}) => {
  const { personal_room } = user

  if (!personal_room) {
    return
  }

  try {
    const response = await new Fetch().get(
      `/rooms/${personal_room}/recs/favorites`
    )

    const { info, data } = response.body

    const listings = getFavorateListingsData(data)
    const normilizedListings = normalize(listings, schema.listingsList)
    return {
      ...normilizedListings,
      info
    }
  } catch (error) {
    throw error
  }
}

export default getFavorites
