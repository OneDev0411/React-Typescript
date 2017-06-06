import { combineReducers } from 'redux'
import { SET_MAP_PROPS } from '../../../constants/listings/search'
import {
  mapInitialState
} from '../../../components/Pages/Dashboard/Mls/Partials/MlsMapOptions'

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
const mapProps = (state = mapInitialState, action) => {
  switch (action.type) {
    case SET_MAP_PROPS:
      return action.mapProps
    default:
      return state
  }
}

const search = combineReducers({
  mapProps
})

export default search

export const getMapProps = state => state.mapProps
