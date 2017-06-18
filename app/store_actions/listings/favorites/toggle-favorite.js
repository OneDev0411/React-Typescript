import { normalize } from 'normalizr'
import api from '../../../models/listings/favorites'
import * as schema from '../../../models/listings/schema'
import { selectListings } from '../../../reducers/listings'
import { getIsFavorite } from '../../../reducers/listings/favorites'
import * as actionsType from '../../../constants/listings/favorites'

const toggleFavorite = listing => (dispatch, getState) => {
  const { data, favorites } = getState()
  const { user } = data

  if (!user) {
    return Promise.resolve()
  }

  const isFavorite = getIsFavorite(favorites.listings, listing.id)

  const handleToggle = listing => {
    const { id } = listing
    const { favorites } = getState()
    const listings = selectListings(favorites.listings)

    if (getIsFavorite(favorites.listings, id)) {
      return listings.filter(list => list.id !== id)
    }

    return {
      ...listings,
      listing
    }
  }

  dispatch({
    tabName: 'FAVORITE',
    type: actionsType.TOGGLE_FAVORITE,
    response: normalize(handleToggle(listing), schema.listingsList)
  })

  dispatch({
    type: actionsType.TOGGLE_FAVORITE_REQUEST
  })

  const { personal_room: roomId } = user
  const { recId, mls_number: mlsNumber } = listing
  const params = {
    recId,
    roomId,
    mlsNumber,
    isFavorite
  }

  return api.toggleFavorites(params).then(
    response => {
      dispatch({
        type: actionsType.TOGGLE_FAVORITE_SUCCESS
      })
    },
    ({ message }) => {
      dispatch({
        type: actionsType.TOGGLE_FAVORITE_FAILURE,
        message: message || 'Something went wrong.'
      })
      dispatch({
        tabName: 'FAVORITE',
        type: actionsType.TOGGLE_FAVORITE,
        response: normalize(handleToggle(listing), schema.listingsList)
      })
    }
  )
}

export default toggleFavorite
