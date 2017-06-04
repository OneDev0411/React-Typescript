import { combineReducers } from 'redux'
import {
  FETCH_FAVORITES_SUCCESS,
  FETCH_FAVORITES_REQUEST,
  FETCH_FAVORITES_FAILURE
} from '../../../constants/favorites'

const byId = (state = {}, action) => {
  if (action.response) {
    return {
      ...state,
      ...action.response.entities.favorite
    }
  }
  return state
}

const allIds = (state = [], action) => {
  switch (action.type) {
    case FETCH_FAVORITES_SUCCESS:
      return action.response.result
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_FAVORITES_REQUEST:
      return true
    case FETCH_FAVORITES_SUCCESS:
    case FETCH_FAVORITES_FAILURE:
      return false
    default:
      return state
  }
}

const errorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_FAVORITES_FAILURE:
      return action.message
    case FETCH_FAVORITES_REQUEST:
    case FETCH_FAVORITES_SUCCESS:
      return null
    default:
      return state
  }
}

const favorites = combineReducers({
  byId,
  allIds,
  isFetching,
  errorMessage
})

export default favorites

export const getFavorites = state =>
  state.allIds.map(id => state.byId[id])

export const getIsFetchingStatus = state => state.isFetching

export const getErrorMessage = state => state.errorMessage