import { combineReducers } from 'redux'

import isWidget from './isWidget'
import listings from './listings'

const widgets = combineReducers({
  listings,
  isWidget
})

export default widgets
