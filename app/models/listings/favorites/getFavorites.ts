import { normalize } from 'normalizr'

import Fetch from '../../../services/fetch'
import * as schema from '../schema'

import { getFavorateListingsData } from './get-favorites'

export const getFavorites = async (user: IUser) => {
  const { personal_room } = user

  if (!personal_room) {
    return Promise.reject(new Error('User has no personal room'))
  }

  try {
    const response = await new Fetch()
      .get(`/rooms/${personal_room}/recs/favorites`)
      .query({ limit: 500 })
      .query({ sorting_value: 'Update' })

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
