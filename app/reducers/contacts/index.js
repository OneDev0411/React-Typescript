import { combineReducers } from 'redux'
import list from './list'
import tags from './tags'
import spinner from './spinner'
import contact from './contact'
import activities from './activities'
import importOutlook from './importOutlook'

export default combineReducers({
  list,
  tags,
  spinner,
  contact,
  activities,
  importOutlook
})
