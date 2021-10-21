import { normalize } from 'normalizr'

import Fetch from '../../../services/fetch'
import * as schema from '../schema'

interface IRecFavoriteCompactListing {
  id: UUID
  room: UUID
  compact_listing: ICompactListing
}

export const getFavorateCompactListingsData = (
  favorites: IRecFavoriteCompactListing[]
) =>
  favorites.map(favorite => {
    const { compact_listing: listing, id: recId, room: recRoom } = favorite

    return {
      ...listing,
      recId,
      recRoom
    }
  })

export const getFavoritesCompactListings = async (user: IUser) => {
  const { personal_room } = user

  if (!personal_room) {
    return Promise.reject(new Error('User has no personal room'))
  }

  try {
    const response = await new Fetch()
      .get(`/rooms/${personal_room}/recs/favorites`)
      .query({ limit: 500 })
      .query({
        sorting_value: 'Update',
        'associations[]': 'recommendation.compact_listing',
        'omit[]': 'recommendation.listing'
      })

    const { info, data } = response.body
    const listings = getFavorateCompactListingsData(data)
    const normilizedListings = normalize(listings, schema.listingsList)

    return {
      ...normilizedListings,
      info
    }
  } catch (error) {
    throw error
  }
}
