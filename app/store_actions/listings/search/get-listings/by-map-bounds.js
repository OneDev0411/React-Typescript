import { SEARCH_BY_MAP_BOUNDS } from '../../../../constants/listings/search'
import { getFetchingStatus } from '../../../../reducers/listings'
import { isAutoMove } from '../../../../reducers/listings/map'
import { generatePointsFromBounds } from '../../../../utils/map'

import getListingsByValert from './by-valert'

const QUERY_LIMIT = 200

const getListingsByMapBounds = bounds => (dispatch, getState) => {
  const { listings, map, type, panels, options } = getState().search
  const { mls_areas, school_districts, subdivisions, counties } = options
  const hasAreaOption =
    mls_areas || school_districts || subdivisions || counties

  if (
    getFetchingStatus(listings) ||
    (type !== 'by_map_bounds' && type !== 'by_google_suggests') ||
    isAutoMove(map) ||
    hasAreaOption ||
    panels.activePanel === 'grid' ||
    (panels.activePanel === 'table' && window.innerWidth < 1920) ||
    map.drawing.points.length
  ) {
    return Promise.resolve()
  }

  dispatch({ type: SEARCH_BY_MAP_BOUNDS })

  const limit = QUERY_LIMIT
  const points = generatePointsFromBounds(bounds)

  const queryOptions = {
    ...options,
    limit,
    points,
    postal_codes: null
  }

  return getListingsByValert(queryOptions)(dispatch, getState)
}

export default getListingsByMapBounds
