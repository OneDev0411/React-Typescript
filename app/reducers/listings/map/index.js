import { combineReducers } from 'redux'
import drawing from './drawing'
import * as actionsType from '../../../constants/listings/map'

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
//   hoveredMarkerId: String || -1
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

const hoveredMarkerId = (state = -1, action) => {
  switch (action.type) {
    case actionsType.SET_MAP_HOVERED_MARKER_ID:
      return action.id
    default:
      return state
  }
}

const map = combineReducers({
  props,
  drawing,
  autoMove,
  hoveredMarkerId
})

export default map

export const isAutoMove = state => state.autoMove
