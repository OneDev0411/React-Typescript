import { combineReducers } from 'redux'
import map from '../map'
import panels from '../panels'
import listings from '../index.js'
import { createNamedWrapperReducer } from '../../../utils/redux-utils'

const favorites = combineReducers({
  map: createNamedWrapperReducer(map, 'FAVORITES'),
  panels: createNamedWrapperReducer(panels, 'FAVORITES'),
  listings: createNamedWrapperReducer(listings, 'FAVORITES')
})

export default favorites

export const getIsFavorite = (state, id) => state.allIds.indexOf(id) !== -1
