import api from '../../../../models/listings/search'
import * as listingsTypes from '../../../../constants/listings'
import { getFetchingStatus } from '../../../../reducers/listings'

const getListingsByMlsNumber = mlsNumber => (dispatch, getState) => {
  if (getFetchingStatus(getState().search.listings)) {
    return Promise.resolve()
  }

  dispatch({
    tabName: 'search',
    type: listingsTypes.FETCH_LISTINGS_REQUEST
  })

  return api.getListings.byMlsNumber(mlsNumber).then(
    response => {
      dispatch({
        response,
        tabName: 'search',
        type: listingsTypes.FETCH_LISTINGS_SUCCESS
      })

      return Promise.resolve(response)
    },
    ({ message }) => {
      dispatch({
        tabName: 'search',
        type: listingsTypes.FETCH_LISTINGS_FAILURE,
        message: message || 'Something went wrong.'
      })

      return Promise.reject(message)
    }
  )
}

export default getListingsByMlsNumber
