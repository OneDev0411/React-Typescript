import Fetch from '../../../services/fetch'
import config from '../../../../config/public'
import { normalize } from 'normalizr'
import * as schema from './schema'

// Helper function
const filterMarkedFavorites = (favorites, userId) =>
  favorites.filter(favorite =>
    favorite.read_by == null ||
    !favorite.read_by.some(id => id === userId)
  )

export const fetchFavorites = async (user = {}) => {
  const { personal_room } = user

  if (!personal_room) {
    return
  }

  try {
    const response = await new Fetch()
      .get(`/rooms/${personal_room}/recs/favorites`)

    const favorites = filterMarkedFavorites(response.body.data, user.id)
    return normalize(favorites, schema.favoritesList)
  } catch (error) {
    throw error
  }
}

export const markFavorite = async (user = {}, id) => {
  const { personal_room } = user

  if (!personal_room || !id) {
    return
  }

  try {
    const response = await new Fetch()
      .patch(`/rooms/${personal_room}/recs/${id}/favorite`)
      .send({ favorite: true })

    return response.body.data.id
  } catch (error) {
    throw error
  }
}

export const unmarkFavorite = async (user = {}, id) => {
  const { personal_room } = user

  if (!personal_room || !id) {
    return
  }

  try {
    const response = await new Fetch()
      .delete(`/rooms/${personal_room}/recs/feed/${id}`)
      .send({ read: true })

    return response.body.data.id
  } catch (error) {
    throw error
  }
}