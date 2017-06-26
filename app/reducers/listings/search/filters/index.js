import { combineReducers } from 'redux'
import isOpen from './isOpen'

const filters = combineReducers({
  isOpen
})

export default filters
