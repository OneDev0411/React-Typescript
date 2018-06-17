import { combineReducers } from 'redux'
import {
  FETCH_LISTING_REQUEST,
  FETCH_LISTING_FAILURE,
  FETCH_LISTING_SUCCESS,
  FETCH_CHANGE_LISTING_FOLLOW_REQUEST,
  FETCH_CHANGE_LISTING_FOLLOW_SUCCESS,
  FETCH_CHANGE_LISTING_FOLLOW_FAILURE
} from '../../../constants/listings/listing'

const data = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LISTING_SUCCESS:
      return {
        ...state,
        ...action.response
      }
    case FETCH_CHANGE_LISTING_FOLLOW_SUCCESS:
      if (action.listing.id === state.id) {
        return action.listing
      }

      return state

    case FETCH_CHANGE_LISTING_FOLLOW_REQUEST:
      if (action.id === state.id) {
        return {
          ...state,
          isFetching: true
        }
      }

      return state

    case FETCH_CHANGE_LISTING_FOLLOW_FAILURE:
      if (action.id === state.id) {
        return {
          ...state,
          isFetching: false
        }
      }

      return state
    default:
      return state
  }
}

export const isFetching = (state = false, action) => {
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

export const errorMessage = (state = null, action) => {
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
