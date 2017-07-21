import { goToPlace } from '../map'
import extendedBounds from '../../../utils/extendedBounds'
import { normalizeListingsForMarkers } from '../../../utils/map'

import * as searchType from './set-type'
import { selectListings } from '../../../reducers/listings'
import getListingsByPostalCode from './get-listings/by-postal-code'

const searchByPostalCode = postalCode => async (dispatch, getState) => {
  if (!postalCode) {
    return
  }

  dispatch(searchType.searchByPostalCode())

  try {
    await getListingsByPostalCode(postalCode)(dispatch, getState)
    const listings = selectListings(getState().search.listings)

    if (listings.length && window.google) {
      const mapProps = getState().search.map.props

      const extendedProps = extendedBounds(
        normalizeListingsForMarkers(listings),
        mapProps
      )

      goToPlace(extendedProps)(dispatch, getState)
      searchType.reset()(dispatch)
    } else {
      searchType.reset()(dispatch)
    }
  } catch (error) {
    throw error
  }
}

export default searchByPostalCode
