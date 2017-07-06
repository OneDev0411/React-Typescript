import getListingsByValert from './by-valert'
import { isAutoMove } from '../../../../reducers/listings/map'
import { getFetchingStatus } from '../../../../reducers/listings'
import { SEARCH_BY_MAP_BOUNDS } from '../../../../constants/listings/search'

const QUERY_LIMIT = 50

const getQueryPoints = bounds => [
  {
    latitude: bounds.ne.lat,
    longitude: bounds.ne.lng
  },
  {
    latitude: bounds.nw.lat,
    longitude: bounds.nw.lng
  },
  {
    latitude: bounds.sw.lat,
    longitude: bounds.sw.lng
  },
  {
    latitude: bounds.se.lat,
    longitude: bounds.se.lng
  },
  {
    latitude: bounds.ne.lat,
    longitude: bounds.ne.lng
  }
]

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
  const points = getQueryPoints(bounds)

  const queryOptions = {
    ...options,
    limit,
    points
  }

  return getListingsByValert(queryOptions)(dispatch, getState)
}

export default getListingsByMapBounds
