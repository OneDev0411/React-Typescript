import { combineReducers } from 'redux'
import { byId, isFetching, errorMessage } from '../shared'
import {
  ADD_ALERT_SUCCESS,
  FETCH_ALERTS_SUCCESS,
  DELETE_ALERT_SUCCESS
} from '../../../constants/listings/alerts'

export const allIds = (state = [], action) => {
  switch (action.type) {
    case ADD_ALERT_SUCCESS:
    case FETCH_ALERTS_SUCCESS:
    case DELETE_ALERT_SUCCESS:
      return action.response.result
    default:
      return state
  }
}

export const info = (state = { total: 0, count: 0 }, action) => {
  switch (action.type) {
    case FETCH_ALERTS_SUCCESS:
      return action.response.info
    case DELETE_ALERT_SUCCESS:
      return {
        count: state.count - 1,
        total: state.total - 1
      }
    case ADD_ALERT_SUCCESS:
      return {
        count: state.count + 1,
        total: state.total + 1
      }
    default:
      return state
  }
}

const list = combineReducers({
  byId,
  allIds,
  info,
  isFetching,
  errorMessage
})

export default list

export const selectAlert = (state, id) => state.byId[id]
