// import { combineReducers } from 'redux'
import { SET_MAP_PROPS } from '../../../constants/listings/map'

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
    default:
      return state
  }
}

export default mapProps