import * as types from '../../../constants/listings/map'
import { isAutoMove } from '../../../reducers/listings/map'
import { getIsFetchingStatus } from '../../../reducers/listings'

export const setOffMapAutoMove = () => ({
  name: 'SEARCH',
  type: types.SET_OFF_MAP_AUTO_MOVE
})

export const setOnMapAutoMove = () => ({
  name: 'SEARCH',
  type: types.SET_ON_MAP_AUTO_MOVE
})

export const setMapProps = (name, mapProps) => ({
  name,
  mapProps,
  type: types.SET_MAP_PROPS
})

export const updateMapZoom = (name, zoomType) => ({
  name,
  type: `${types.SET_MAP_ZOOM}_${zoomType}`
})

export const setMapHoveredMarkerId = (name, id) => ({
  id,
  name,
  type: types.SET_MAP_HOVERED_MARKER_ID
})

export const goToPlace = mapProps => (dispatch, getState) => {
  const { listings, map } = getState().search

  if (getIsFetchingStatus(listings) || isAutoMove(map)) {
    return Promise.resolve()
  }

  dispatch(setOnMapAutoMove())
  dispatch(setMapProps('SEARCH', mapProps))
}