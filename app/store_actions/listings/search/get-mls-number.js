import api from '../../../models/listings/search'
import * as listingsTypes from '../../../constants/listings'
import { getIsFetchingStatus } from '../../../reducers/listings'

const getMlsNumber = mlsNumber => (dispatch, getState) => {
  if (getIsFetchingStatus(getState().search.listings)) {
    return Promise.resolve()
  }

  dispatch({
    name: 'SEARCH',
    type: listingsTypes.FETCH_LISTINGS_REQUEST
  })

  return api.getListings.byMlsNumber(mlsNumber).then(
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

export default getMlsNumber