import { combineReducers } from 'redux'

import { byId, info, allIds, isFetching, errorMessage } from '../shared'

const list = combineReducers({
  byId,
  allIds,
  info,
  isFetching,
  errorMessage
})

export default list
