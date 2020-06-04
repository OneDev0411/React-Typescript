import { combineReducers } from 'redux'

import * as actionsType from '../../../constants/listings/map'

import drawing from './drawing'
import userLocation from './user-location'

// initial map options(props) schema
// {
//   zoom: Number(int),
//   center: {
//     lat: Number(float),
//     lng: Number(float)
//   },
//   size: Object,
//   bounds: Object
//   autoMove: Boolean
// }
const props = (state = {}, action) => {
  switch (action.type) {
    case actionsType.SET_MAP_PROPS:
      return {
        ...state,
        ...action.mapProps
      }
    case actionsType.SET_MAP_ZOOM_IN:
      return {
        ...state,
        zoom: ++state.zoom
      }
    case actionsType.SET_MAP_ZOOM_OUT:
      return {
        ...state,
        zoom: --state.zoom
      }
    default:
      return state
  }
}

const autoMove = (state = false, action) => {
  switch (action.type) {
    case actionsType.SET_ON_MAP_AUTO_MOVE:
      return true
    case actionsType.SET_OFF_MAP_AUTO_MOVE:
      return false
    default:
      return state
  }
}

const map = combineReducers({
  props,
  drawing,
  userLocation,
  autoMove
})

export default map

export const isAutoMove = state => state.autoMove
