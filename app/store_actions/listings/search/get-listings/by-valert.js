import api from '../../../../models/listings/search'
import setSearchListingsOptions from '../set-options'
import * as listingsTypes from '../../../../constants/listings'
import { DECLUSTER_ZOOM_LEVEL } from '../../../../components/Pages/Dashboard/Listings/mapOptions'

const getListingsByValert = options => (dispatch, getState) => {
  const { data, search } = getState()
  const { brand } = data
  const { zoom } = search.map.props

  let query

  if (brand && zoom >= DECLUSTER_ZOOM_LEVEL) {
    query = '?associations=compact_listing.proposed_agent'

    const office = brand.offices && brand.offices[0] ? brand.offices[0] : ''

    if (office) {
      query += `&order_by[]=office&order_by[]=status&office=${office}`
    }
  }

  try {
    dispatch(setSearchListingsOptions(options))

    dispatch({
      tabName: 'search',
      type: listingsTypes.FETCH_LISTINGS_REQUEST
    })

    return api.getListings.byValert(options, query).then(
      response => {
        dispatch({
          response,
          tabName: 'search',
          type: listingsTypes.FETCH_LISTINGS_SUCCESS
        })
      },
      ({ message }) => {
        dispatch({
          tabName: 'search',
          type: listingsTypes.FETCH_LISTINGS_FAILURE,
          message: message || 'Something went wrong.'
        })
      }
    )
  } catch (error) {
    dispatch({
      tabName: 'search',
      type: listingsTypes.FETCH_LISTINGS_FAILURE,
      message: error.message || 'Something went wrong.'
    })
    throw error
  }
}

export default getListingsByValert
