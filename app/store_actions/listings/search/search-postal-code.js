import { goToPlace } from '../map'
import extendedBounds from '../../../utils/extendedBounds'
import { normalizeListingsForMarkers } from '../../../utils/map'

import { selectListings } from '../../../reducers/listings'
import getListingsByPostalCode from './get-listings/by-postal-code'
import { reset as resetSearchType, setSearchType } from './set-type'
import { SEARCH_BY_POSTAL_CODE } from '../../../constants/listings/search'

const searchByPostalCode = postalCode => async (dispatch, getState) => {
  if (!postalCode) {
    return
  }

  try {
    await getListingsByPostalCode(postalCode)(dispatch, getState)

    const listings = selectListings(getState().search.listings)

    if (listings.length && window.google) {
      dispatch(setSearchType(SEARCH_BY_POSTAL_CODE))

      const mapProps = getState().search.map.props

      const extendedProps = extendedBounds(
        normalizeListingsForMarkers(listings),
        mapProps
      )

      goToPlace(extendedProps)(dispatch, getState)
    }
  } catch (error) {
    throw error
  }
}

export default searchByPostalCode
