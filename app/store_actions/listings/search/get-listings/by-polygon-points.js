import { batchActions } from 'redux-batched-actions'

import getListingsByValert from './by-valert'
import { SEARCH_BY_POLYGON_POINTS } from '../../../../constants/listings/search'
import { allLocationBasedFilterOptions } from '../../../../utils/map'
import resetAreasOptions from '../reset-areas-options'
import setSearchInput from '../set-search-input'
import { setSearchLocation } from '../set-search-location'

const getListingsByPolygonPoints = (points = []) => (dispatch, getState) => {
  if (points.length === 0) {
    return Promise.resolve()
  }

  const options = {
    ...getState().search.options,
    limit: 200,
    points,
    postal_codes: null,
    ...allLocationBasedFilterOptions
  }

  batchActions([
    dispatch(resetAreasOptions()),
    dispatch(setSearchInput('')),
    dispatch(setSearchLocation(null)),
    dispatch({ type: SEARCH_BY_POLYGON_POINTS }),
    dispatch(getListingsByValert(options))
  ])
}

export default getListingsByPolygonPoints
