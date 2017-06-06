import * as types from '../../../constants/listings/map'

export const setMapProps = (name, mapProps) => ({
  name,
  mapProps,
  type: types.SET_MAP_PROPS
})