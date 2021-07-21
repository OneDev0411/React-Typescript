import * as listingsTypes from '../../../constants/listings'
import api from '../../../models/listings/favorites'
import { getFetchingStatus } from '../../../reducers/listings'

const getFavorites = user => (dispatch, getState) => {
  if (getFetchingStatus(getState().favorites.listings)) {
    return Promise.resolve()
  }

  dispatch({
    tabName: 'favorites',
    type: listingsTypes.FETCH_LISTINGS_REQUEST
  })

  return api.getFavorites(user).then(
    response => {
      dispatch({
        response,
        tabName: 'favorites',
        type: listingsTypes.FETCH_LISTINGS_SUCCESS
      })
    },
    ({ message }) => {
      dispatch({
        tabName: 'favorites',
        type: listingsTypes.FETCH_LISTINGS_FAILURE,
        message: message || 'Something went wrong.'
      })
    }
  )
}

export default getFavorites
