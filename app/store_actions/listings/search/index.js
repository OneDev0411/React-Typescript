import * as api from '../../../models/listings/favorites'
import * as listingsTypes from '../../../constants/listings'
import * as searcTypes from '../../../constants/listings/search'
import { getIsFetchingStatus } from '../../../reducers/listings'

export const fetchFavorites = user => (dispatch, getState) => {
  if (getIsFetchingStatus(getState().favorites.listings)) {
    return Promise.resolve()
  }

  dispatch({
    name: 'SEARCH',
    type: listingsTypes.FETCH_LISTINGS_REQUEST
  })

  return api.fetchFavorites(user).then(
    (response) => {
      dispatch({
        response,
        name: 'SEARCH',
        type: listingsTypes.FETCH_LISTINGS_SUCCESS
      })
    },
    ({ message }) => {
      dispatch({
        name: 'SEARCH',
        type: listingsTypes.FETCH_LISTINGS_FAILURE,
        message: message || 'Something went wrong.'
      })
    }
  )
}