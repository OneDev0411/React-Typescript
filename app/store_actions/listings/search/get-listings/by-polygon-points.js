import getListingsByValert from './by-valert'
import { isAutoMove } from '../../../../reducers/listings/map'
import { getFetchingStatus } from '../../../../reducers/listings'
import { queryOptions } from '../../../../components/Pages/Dashboard/Listings/mapOptions'
import { SEARCH_BY_POLYGON_POINTS } from '../../../../constants/listings/search'

const QUERY_LIMIT = 500

const getListingsByPolygonPoints = (points = []) => (dispatch, getState) => {
  if (!points.length) {
    return Promise.resolve()
  }

  dispatch({ type: SEARCH_BY_POLYGON_POINTS })

  const limit = QUERY_LIMIT

  const options = {
    ...getState().search.options,
    limit,
    points,
    postal_codes: null,
    counties: null,
    mls_areas: null,
    subdivisions: null,
    school_districts: null,
    high_schools: null,
    middle_schools: null,
    primary_schools: null,
    elementary_schools: null,
    senior_high_schools: null,
    junior_high_schools: null,
    intermediate_schools: null
  }

  return getListingsByValert(options)(dispatch, getState)
}

export default getListingsByPolygonPoints
