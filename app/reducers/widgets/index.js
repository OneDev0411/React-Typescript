import { combineReducers } from 'redux'
import listings from './listings'
import isWidget from './isWidget'

const widgets = combineReducers({
  listings,
  isWidget
})

export default widgets
