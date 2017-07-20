import { combineReducers } from 'redux'
import listing from './listing'
import { createNamedWrapperReducer } from '../../utils/redux-utils'

const widgets = combineReducers({
  listing: createNamedWrapperReducer(listing, 'listing')
})

export default widgets
