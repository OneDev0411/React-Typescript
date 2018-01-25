import { combineReducers } from 'redux'
import list from './list'
import tags from './tags'
import importOutlook from './importOutlook'

export default combineReducers({
  list,
  tags,
  importOutlook
})
