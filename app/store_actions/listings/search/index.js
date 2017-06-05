import * as types from '../../../constants/listings/search'

export const setMapProps = gmap => ({
  type: types.SET_MAP_PROPS,
  options: gmap
})
