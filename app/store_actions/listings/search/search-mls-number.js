import { goToPlace } from '../map'

import * as searchType from './set-type'
import { selectListings } from '../../../reducers/listings'
import getListingsByMlsNumber from './get-listings/by-mls-number'

const searchByMlsNumber = mlsNumber => async (dispatch, getState) => {
  if (!mlsNumber) {
    return
  }

  dispatch(searchType.searchByMlsNumber())

  try {
    await getListingsByMlsNumber(mlsNumber)(dispatch, getState)
    const listing = selectListings(getState().search.listings)[0]
    if (listing) {
      const {
        latitude: lat,
        longitude: lng
      } = listing.property.address.location

      const place = { center: { lat, lng }, zoom: 17 }

      goToPlace(place)(dispatch, getState)
      searchType.reset()(dispatch)
    }
  } catch (error) {
    throw error
  }
}

export default searchByMlsNumber
