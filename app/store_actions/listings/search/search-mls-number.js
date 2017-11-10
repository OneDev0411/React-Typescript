import { goToPlace } from '../map'

import { selectListings } from '../../../reducers/listings'
import getListingsByMlsNumber from './get-listings/by-mls-number'
import { reset as resetSearchType, setSearchType } from './set-type'
import { SEARCH_BY_MLS_NUMBER } from '../../../constants/listings/search'

const searchByMlsNumber = mlsNumber => async (dispatch, getState) => {
  if (!mlsNumber) {
    return
  }

  try {
    await getListingsByMlsNumber(mlsNumber)(dispatch, getState)

    const listing = selectListings(getState().search.listings)[0]

    if (listing) {
      dispatch(setSearchType(SEARCH_BY_MLS_NUMBER))

      const {
        latitude: lat,
        longitude: lng
      } = listing.property.address.location

      const place = { center: { lat, lng }, zoom: 17 }

      goToPlace(place)(dispatch, getState)
      resetSearchType()(dispatch)
    }
  } catch (error) {
    resetSearchType()(dispatch)
    throw error
  }
}

export default searchByMlsNumber
