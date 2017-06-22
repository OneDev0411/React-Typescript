import { combineReducers } from 'redux'
import {
  FETCH_LISTING_SUCCESS,
  FETCH_LISTING_REQUEST,
  FETCH_LISTING_FAILURE
} from '../../../constants/listings/listing'

const data = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LISTING_SUCCESS:
      return {
        ...state,
        ...action.response
      }
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_LISTING_REQUEST:
      return true
    case FETCH_LISTING_SUCCESS:
    case FETCH_LISTING_FAILURE:
      return false
    default:
      return state
  }
}

const errorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_LISTING_FAILURE:
      return action.message
    case FETCH_LISTING_REQUEST:
    case FETCH_LISTING_SUCCESS:
      return null
    default:
      return state
  }
}

const listing = combineReducers({
  data,
  isFetching,
  errorMessage
})

export default listing
