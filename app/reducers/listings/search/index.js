import { combineReducers } from 'redux'
import map from '../map'
import listings from '../index.js'
import { createNamedWrapperReducer } from '../../../utils/redux-utils'

const search = combineReducers({
  map: createNamedWrapperReducer(map, 'SEARCH'),
  listings: createNamedWrapperReducer(listings, 'SEARCH')
})

export default search
