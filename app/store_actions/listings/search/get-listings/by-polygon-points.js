import getListingsByValert from './by-valert'
import { isAutoMove } from '../../../../reducers/listings/map'
import { getFetchingStatus } from '../../../../reducers/listings'
import { queryOptions } from '../../../../components/Pages/Dashboard/Listings/mapOptions'
import { SEARCH_BY_POLYGON_POINTS } from '../../../../constants/listings/search'
import { allLocationBasedFilterOptions } from '../../../../utils/map'
import resetAreasOptions from '../reset-areas-options'

const QUERY_LIMIT = 500

const getListingsByPolygonPoints = (points = []) => (dispatch, getState) => {
  if (!points.length) {
    return Promise.resolve()
  }

  dispatch(resetAreasOptions())
  dispatch({ type: SEARCH_BY_POLYGON_POINTS })

  const limit = QUERY_LIMIT

  const options = {
    ...getState().search.options,
    limit,
    points,
    postal_codes: null,
    ...allLocationBasedFilterOptions
  }

  return getListingsByValert(options)(dispatch, getState)
}

export default getListingsByPolygonPoints
