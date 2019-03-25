import { batchActions } from 'redux-batched-actions'

import { searchListings } from 'models/listings/search/search-listings'

import * as listingsTypes from '../../../constants/listings'

export const getListingsByQuery = (text, query) => async dispatch => {
  try {
    batchActions([
      dispatch({
        tabName: 'search',
        type: listingsTypes.FETCH_LISTINGS_REQUEST
      })
    ])

    const response = await searchListings(text, query)

    dispatch({
      response,
      tabName: 'search',
      type: listingsTypes.FETCH_LISTINGS_SUCCESS
    })
  } catch (error) {
    dispatch({
      tabName: 'search',
      type: listingsTypes.FETCH_LISTINGS_FAILURE,
      message: error.message || 'Something went wrong.'
    })
  }
}
