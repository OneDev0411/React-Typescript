import { combineReducers } from 'redux'
import map from '../map'
import panels from '../panels'
import type from './searchType'
import listings from '../index.js'
import { createNamedWrapperReducer } from '../../../utils/redux-utils'

const search = combineReducers({
  type,
  map: createNamedWrapperReducer(map, 'SEARCH'),
  panels: createNamedWrapperReducer(panels, 'SEARCH'),
  listings: createNamedWrapperReducer(listings, 'SEARCH')
})

export default search
