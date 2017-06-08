import { combineReducers } from 'redux'
import map from '../map'
import listings from '../index.js'
import { createNamedWrapperReducer } from '../../../utils/redux-utils'

const favorites = combineReducers({
  map: createNamedWrapperReducer(map, 'FAVORITE'),
  listings: createNamedWrapperReducer(listings, 'FAVORITE')
})

export default favorites