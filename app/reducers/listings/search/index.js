import { combineReducers } from 'redux'
import mapProps from '../map'
import listings from '../index.js'
import { createNamedWrapperReducer } from '../../../utils/redux-utils'

const search = combineReducers({
  listings: createNamedWrapperReducer(listings, 'SEARCH'),
  mapProps: createNamedWrapperReducer(mapProps, 'SEARCH')
})

export default search
