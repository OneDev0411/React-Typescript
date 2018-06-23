import { combineReducers } from 'redux'
import map from '../map'
import panels from '../panels'
import listings from './list'
import { createNamedWrapperReducer } from '../../../utils/redux-utils'

const favorites = combineReducers({
  map: createNamedWrapperReducer(map, 'favorites'),
  panels: createNamedWrapperReducer(panels, 'favorites'),
  listings: createNamedWrapperReducer(listings, 'favorites')
})

export default favorites

export const getIsFavorite = (state, id) => state.allIds.indexOf(id) !== -1
