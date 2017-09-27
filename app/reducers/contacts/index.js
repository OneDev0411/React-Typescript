import { combineReducers } from 'redux'
import list from './list'
import tags from './tags'

export default combineReducers({
  list,
  tags
})
