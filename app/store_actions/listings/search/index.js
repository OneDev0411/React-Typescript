import * as api from '../../../models/listings/search'
import * as listingsTypes from '../../../constants/listings'
import { getIsFetchingStatus } from '../../../reducers/listings'
import { queryOptions } from
  '../../../components/Pages/Dashboard/Mls/Partials/MlsMapOptions'

const QUERY_LIMIT = 150

const getQueryPoints = bounds => ([
  {
    latitude: bounds.ne.lat,
    longitude: bounds.ne.lng
  },
  {
    latitude: bounds.nw.lat,
    longitude: bounds.nw.lng
  },
  {
    latitude: bounds.sw.lat,
    longitude: bounds.sw.lng
  },
  {
    latitude: bounds.se.lat,
    longitude: bounds.se.lng
  },
  {
    latitude: bounds.ne.lat,
    longitude: bounds.ne.lng
  }
])

export const fetchListings = mapProps => (dispatch, getState) => {
  if (getIsFetchingStatus(getState().search.listings)) {
    return Promise.resolve()
  }

  dispatch({
    name: 'SEARCH',
    type: listingsTypes.FETCH_LISTINGS_REQUEST
  })

  const limit = QUERY_LIMIT
  const points = getQueryPoints(mapProps.bounds)

  const options = {
    ...queryOptions,
    limit,
    points
  }

  return api.fetchListings(options).then(
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