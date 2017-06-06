import { getFavorites, getIsFetchingStatus } from
  '../../../reducers/listings/favorites'
import * as types from '../../../constants/favorites'
import * as api from '../../../models/listings/favorites'

export const fetchFavorites = user => (dispatch, getState) => {
  if (getIsFetchingStatus(getState().favorites)) {
    return Promise.resolve()
  }

  dispatch({ type: types.FETCH_FAVORITES_REQUEST })

  return api.fetchFavorites(user).then(
    (response) => {
      dispatch({
        type: types.FETCH_FAVORITES_SUCCESS,
        response
      })
    },
    ({ message }) => {
      dispatch({
        type: types.FETCH_FAVORITES_FAILURE,
        message: message || 'Something went wrong.'
      })
    }
  )
}