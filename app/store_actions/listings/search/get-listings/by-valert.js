import api from '../../../../models/listings/search'
import * as listingsTypes from '../../../../constants/listings'

const getListingsByValert = options => (dispatch, getState) => {
  try {
    dispatch({
      tabName: 'SEARCH',
      type: listingsTypes.FETCH_LISTINGS_REQUEST
    })

    return api.getListings.byValert(options).then(
      response => {
        dispatch({
          response,
          tabName: 'SEARCH',
          type: listingsTypes.FETCH_LISTINGS_SUCCESS
        })
      },
      ({ message }) => {
        dispatch({
          tabName: 'SEARCH',
          type: listingsTypes.FETCH_LISTINGS_FAILURE,
          message: message || 'Something went wrong.'
        })
      }
    )
  } catch (error) {
    dispatch({
      tabName: 'SEARCH',
      type: listingsTypes.FETCH_LISTINGS_FAILURE,
      message: error.message || 'Something went wrong.'
    })
    throw error
  }
}

export default getListingsByValert
