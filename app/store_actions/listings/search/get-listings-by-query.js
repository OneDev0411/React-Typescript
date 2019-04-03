import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'

import { setMapProps, setOnMapAutoMove } from 'actions/listings/map'
import searchActions from 'actions/listings/search'

import extendedBounds from 'utils/extendedBounds'

import * as schema from 'models/listings/schema'
import { searchListings } from 'models/listings/search/search-listings'

import * as listingsTypes from '../../../constants/listings'

export const getListingsByQuery = (text, query) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      tabName: 'search',
      type: listingsTypes.FETCH_LISTINGS_REQUEST
    })

    const response = await searchListings(text, query)

    const { code, info, data } = response

    const normalizedListings = normalize(data, schema.listingsList)

    const successPatch = {
      response: {
        ...normalizedListings,
        info: {
          code,
          ...info
        }
      },
      tabName: 'search',
      type: listingsTypes.FETCH_LISTINGS_SUCCESS
    }

    if (data.length === 0) {
      return dispatch(successPatch)
    }

    const newProps = extendedBounds(
      data
        .filter(l => l.location != null)
        .map(({ location: { latitude: lat, longitude: lng } }) => ({
          lat,
          lng
        })),
      getState().search.map.props
    )

    batchActions([
      dispatch(setOnMapAutoMove()),
      dispatch(setMapProps('search', newProps)),
      dispatch(successPatch),
      dispatch(searchActions.setSearchInput(text))
    ])
  } catch (error) {
    dispatch({
      tabName: 'search',
      type: listingsTypes.FETCH_LISTINGS_FAILURE,
      message: error.message || 'Something went wrong.'
    })
  }
}
