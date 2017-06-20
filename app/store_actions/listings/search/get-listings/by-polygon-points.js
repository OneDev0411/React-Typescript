import getListingsByValert from './by-valert'
import { isAutoMove } from '../../../../reducers/listings/map'
import { getFetchingStatus } from '../../../../reducers/listings'
import { queryOptions } from '../../../../components/Pages/Dashboard/Mls/Partials/MlsMapOptions'
import { SEARCH_BY_POLYGON_POINTS } from '../../../../constants/listings/search'

const QUERY_LIMIT = 500

const getListingsByPolygonPoints = (points = []) => (dispatch, getState) => {
  if (!points.length) {
    return Promise.resolve()
  }

  dispatch({ type: SEARCH_BY_POLYGON_POINTS })

  const limit = QUERY_LIMIT

  const options = {
    ...queryOptions,
    limit,
    points
  }

  return getListingsByValert(options)(dispatch, getState)
}

export default getListingsByPolygonPoints
