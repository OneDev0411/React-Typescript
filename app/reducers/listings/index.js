import { combineReducers } from 'redux'
import {
  FETCH_LISTINGS_SUCCESS,
  FETCH_LISTINGS_REQUEST,
  FETCH_LISTINGS_FAILURE
} from '../../constants/listings'

const byId = (state = {}, action) => {
  if (action.response) {
    return {
      ...state,
      ...action.response.entities.listings
    }
  }
  return state
}

const allIds = (state = [], action) => {
  switch (action.type) {
    case FETCH_LISTINGS_SUCCESS:
      return action.response.result
    default:
      return state
  }
}

const status = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LISTINGS_SUCCESS:
      return action.response.status
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_LISTINGS_REQUEST:
      return true
    case FETCH_LISTINGS_SUCCESS:
    case FETCH_LISTINGS_FAILURE:
      return false
    default:
      return state
  }
}

const errorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_LISTINGS_FAILURE:
      return action.message
    case FETCH_LISTINGS_REQUEST:
    case FETCH_LISTINGS_SUCCESS:
      return null
    default:
      return state
  }
}

const listings = combineReducers({
  byId,
  allIds,
  status,
  isFetching,
  errorMessage
})

export default listings

export const getListings = state =>
  state.allIds.map(id => state.byId[id])

export const getIsFetchingStatus = state => state.isFetching

export const getErrorMessage = state => state.errorMessage