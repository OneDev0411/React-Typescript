import { combineReducers } from 'redux'

import { FETCH_ALERT_FEED_SUCCESS } from '../../../constants/listings/alerts'
import { isFetching, errorMessage } from '../shared'

const byAlertId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_ALERT_FEED_SUCCESS:
      return {
        ...state,
        ...action.response
      }
    default:
      return state
  }
}

const feed = combineReducers({
  byAlertId,
  isFetching,
  errorMessage
})

export default feed
