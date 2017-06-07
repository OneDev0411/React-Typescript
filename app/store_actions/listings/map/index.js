import * as types from '../../../constants/listings/map'

export const setMapProps = (name, mapProps) => ({
  name,
  mapProps,
  type: types.SET_MAP_PROPS
})

export const updateMapZoom = (name, zoomType) => ({
  name,
  type: `${types.SET_MAP_ZOOM}_${zoomType}`
})