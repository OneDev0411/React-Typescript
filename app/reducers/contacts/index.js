import { combineReducers } from 'redux'
import list from './list'
import tags from './tags'
import importOutlook from './importOutlook'
import spinner from './spinner'

export default combineReducers({
  list,
  tags,
  importOutlook,
  spinner
})
