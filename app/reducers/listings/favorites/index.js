import { combineReducers } from 'redux'
import mapProps from '../map'
import listings from '../index.js'
import { createNamedWrapperReducer } from '../../../utils/redux-utils'


const favorites = combineReducers({
  listings: createNamedWrapperReducer(listings, 'FAVORITE'),
  mapProps: createNamedWrapperReducer(mapProps, 'FAVORITE')
})

export default favorites