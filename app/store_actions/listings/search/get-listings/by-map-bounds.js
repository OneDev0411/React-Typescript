import getListingsByValert from './by-valert'
import { isAutoMove } from '../../../../reducers/listings/map'
import { getFetchingStatus } from '../../../../reducers/listings'
import { SEARCH_BY_MAP_BOUNDS } from '../../../../constants/listings/search'
import { generatePointsFromBounds } from '../../../../utils/map'

const QUERY_LIMIT = 200

const getListingsByMapBounds = bounds => (dispatch, getState) => {
  const { listings, map, type, panels, options } = getState().search

  if (
    getFetchingStatus(listings) ||
    type !== 'by_map_bounds' ||
    isAutoMove(map) ||
    panels.activePanel === 'grid' ||
    (panels.activePanel === 'table' && window.innerWidth < 1600) ||
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
