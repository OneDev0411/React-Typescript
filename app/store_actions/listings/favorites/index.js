import { getIsFetchingStatus } from
  '../../../reducers/listings'
import * as listingsTypes from '../../../constants/listings'
// import * as favoritesTypes from '../../../constants/listings/favorites'
import * as api from '../../../models/listings/favorites'

export const fetchFavorites = user => (dispatch, getState) => {
  if (getIsFetchingStatus(getState().favorites.listings)) {
    return Promise.resolve()
  }

  dispatch({
    name: 'FAVORITE',
    type: listingsTypes.FETCH_LISTINGS_REQUEST
  })

  return api.fetchFavorites(user).then(
    (response) => {
      dispatch({
        response,
        name: 'FAVORITE',
        type: listingsTypes.FETCH_LISTINGS_SUCCESS
      })
    },
    ({ message }) => {
      dispatch({
        name: 'FAVORITE',
        type: listingsTypes.FETCH_LISTINGS_FAILURE,
        message: message || 'Something went wrong.'
      })
    }
  )
}