import {
  FETCH_LISTINGS_SUCCESS,
  FETCH_LISTINGS_REQUEST,
  FETCH_LISTINGS_FAILURE
} from '../../../constants/listings'
import {
  FETCH_LISTING_SUCCESS,
  FETCH_LISTING_REQUEST,
  FETCH_LISTING_FAILURE
} from '../../../constants/listings/listing'
import {
  FETCH_ALERTS_SUCCESS,
  FETCH_ALERTS_REQUEST,
  FETCH_ALERTS_FAILURE,
  CLEAR_ALERT_NOTIFICATION,
  FETCH_ALERT_LISTINGS_SUCCESS,
  FETCH_ALERT_LISTINGS_REQUEST,
  FETCH_ALERT_LISTINGS_FAILURE
} from '../../../constants/listings/alerts'
import { TOGGLE_FAVORITE } from '../../../constants/listings/favorites'

export const byId = (state = {}, action) => {
  if (action.response) {
    return {
      ...state,
      ...action.response.entities.listings
    }
  }
  return state
}

export const allIds = (state = [], action) => {
  switch (action.type) {
    case TOGGLE_FAVORITE:
    case FETCH_ALERTS_SUCCESS:
    case FETCH_LISTINGS_SUCCESS:
    case CLEAR_ALERT_NOTIFICATION:
      return action.response.result
    default:
      return state
  }
}

export const info = (state = {}, action) => {
  switch (action.type) {
    case TOGGLE_FAVORITE:
    case FETCH_LISTINGS_SUCCESS:
      return {
        ...state,
        ...action.response.info
      }
    default:
      return state
  }
}

export const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_ALERTS_REQUEST:
    case FETCH_LISTING_REQUEST:
    case FETCH_LISTINGS_REQUEST:
    case FETCH_ALERT_LISTINGS_REQUEST:
      return true
    case FETCH_ALERTS_SUCCESS:
    case FETCH_ALERTS_FAILURE:
    case FETCH_LISTING_SUCCESS:
    case FETCH_LISTING_FAILURE:
    case FETCH_LISTINGS_SUCCESS:
    case FETCH_LISTINGS_FAILURE:
    case FETCH_ALERT_LISTINGS_SUCCESS:
    case FETCH_ALERT_LISTINGS_FAILURE:
      return false
    default:
      return state
  }
}

export const errorMessage = (state = null, action) => {
  switch (action.type) {
    case FETCH_ALERTS_FAILURE:
    case FETCH_LISTING_FAILURE:
    case FETCH_LISTINGS_FAILURE:
    case FETCH_ALERT_LISTINGS_FAILURE:
      return action.message
    case FETCH_ALERTS_REQUEST:
    case FETCH_ALERTS_SUCCESS:
    case FETCH_LISTING_REQUEST:
    case FETCH_LISTING_SUCCESS:
    case FETCH_LISTINGS_REQUEST:
    case FETCH_LISTINGS_SUCCESS:
    case FETCH_ALERT_LISTINGS_REQUEST:
    case FETCH_ALERT_LISTINGS_SUCCESS:
      return null
    default:
      return state
  }
}
