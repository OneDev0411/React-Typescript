import { combineReducers } from 'redux'
import { isFetching, errorMessage } from '../shared'
import { FETCH_ALERT_LISTINGS_SUCCESS } from '../../../constants/listings/alerts'

const byAlertId = (state = {}, action) => {
  switch (action.type) {
    case FETCH_ALERT_LISTINGS_SUCCESS:
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
