import Fetch from '../../../services/fetch'
import config from '../../../../config/public'
import { normalize } from 'normalizr'
import * as schema from './schema'


export const fetchFavorites = async (user = {}) => {
  const { personal_room } = user

  if (!personal_room) {
    return
  }

  try {
    const response = await new Fetch()
      .get(`/rooms/${personal_room}/recs/favorites`)

    return normalize(response.body.data, schema.favoritesList)
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