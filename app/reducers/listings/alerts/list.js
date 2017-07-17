import { combineReducers } from 'redux'
import { byId, allIds, isFetching, errorMessage } from '../shared'

const list = combineReducers({
  byId,
  allIds,
  isFetching,
  errorMessage
})

export default list
