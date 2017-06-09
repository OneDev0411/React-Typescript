import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

const getFavorateListingsData = favorites =>
  favorites.map((favorite) => {
    const { listing } = favorite
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

export const fetchFavorites = async (user = {}) => {
  const { personal_room } = user

  if (!personal_room) {
    return
  }

  try {
    const response = await new Fetch()
      .get(`/rooms/${personal_room}/recs/favorites`)

    const { code, info, data } = response.body
    const listings = getFavorateListingsData(data)
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

export const toggleFavorite = async (user = {}, recId, favorite) => {
  const { personal_room } = user

  if (!personal_room || !recId || typeof favorite !== 'boolean') {
    return
  }

  try {
    const response = await new Fetch()
      .patch(`/rooms/${personal_room}/recs/${recId}/favorite`)
      .send({ favorite })

    return response.body.data.status
  } catch (error) {
    throw error
  }
}