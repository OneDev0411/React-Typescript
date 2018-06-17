import { combineReducers } from 'redux'

import {
  byIdWithFollow,
  info,
  allIds,
  isFetching,
  errorMessage
} from '../shared'


const list = combineReducers({
  byId: byIdWithFollow,
  allIds,
  info,
  isFetching,
  errorMessage
})

export default list
