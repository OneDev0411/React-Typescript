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
      const { id, lat, lng } = listing
      const center = { lat, lng }

      goToPlace({ center, zoom: 17 })(dispatch, getState)
      searchType.reset()(dispatch)
    }
  } catch (error) {
    throw error
  }
}

export default searchByMlsNumber