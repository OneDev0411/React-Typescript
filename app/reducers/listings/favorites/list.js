import { combineReducers } from 'redux'
import { byId, info, allIds, isFetching, errorMessage } from '../shared'
import {
  FETCH_LISTING_SUCCESS,
  FETCH_CHANGE_LISTING_FOLLOW_REQUEST,
  FETCH_CHANGE_LISTING_FOLLOW_SUCCESS,
  FETCH_CHANGE_LISTING_FOLLOW_FAILURE
} from '../../../constants/listings/listing'

export const extendedById = (state = {}, action) => {
  let extendedState = state

  switch (action.type) {
    case FETCH_LISTING_SUCCESS:
      return {
        ...state,
        ...action.response
      }
    case FETCH_CHANGE_LISTING_FOLLOW_SUCCESS:
      extendedState = {
        ...state,
        [action.listing.id]: action.listing
      }
      break
    case FETCH_CHANGE_LISTING_FOLLOW_REQUEST:
      extendedState = {
        ...state,
        [action.id]: {
          ...state[action.id],
          isFetching: true
        }
      }
      break
    case FETCH_CHANGE_LISTING_FOLLOW_FAILURE:
      extendedState = {
        ...state,
        [action.id]: {
          ...state[action.id],
          isFetching: false
        }
      }
      break
    default:
      extendedState = state
  }

  return byId(extendedState, action)
}

const list = combineReducers({
  byId: extendedById,
  allIds,
  info,
  isFetching,
  errorMessage
})

export default list
