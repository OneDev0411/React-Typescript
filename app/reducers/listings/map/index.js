// import { combineReducers } from 'redux'
import {
  SET_MAP_PROPS,
  SET_MAP_ZOOM_IN,
  SET_MAP_ZOOM_OUT } from '../../../constants/listings/map'

// initial map options(props) schema
// {
//   zoom: Number(int),
//   center: {
//     lat: Number(float),
//     lng: Number(float)
//   },
//   size: Object,
//   bounds: Object
// }
const mapProps = (state = {}, action) => {
  switch (action.type) {
    case SET_MAP_PROPS:
      return action.mapProps
    case SET_MAP_ZOOM_IN:
      const result = {
        ...state,
        zoom: ++state.zoom
      }
      return result
    case SET_MAP_ZOOM_OUT:
      return {
        ...state,
        zoom: --state.zoom
      }
    default:
      return state
  }
}

export default mapProps

// export const getMapProps = state => state.mapProps