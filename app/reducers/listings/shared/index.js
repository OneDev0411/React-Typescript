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
  ADD_ALERT_FAILURE,
  FETCH_ALERTS_SUCCESS,
  FETCH_ALERTS_REQUEST,
  FETCH_ALERTS_FAILURE,
  DELETE_ALERT_FAILURE,
  CLEAR_ALERT_NOTIFICATION,
  FETCH_ALERT_FEED_SUCCESS,
  FETCH_ALERT_FEED_REQUEST,
  FETCH_ALERT_FEED_FAILURE
} from '../../../constants/listings/alerts'
import {
  TOGGLE_FAVORITE,
  TOGGLE_FAVORITE_REQUEST,
  TOGGLE_FAVORITE_SUCCESS,
  TOGGLE_FAVORITE_FAILURE
} from '../../../constants/listings/favorites'

export const byId = (state = {}, action) => {
  if (
    action.response &&
    action.response.entities &&
    action.response.entities.listings
  ) {
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
    case FETCH_LISTINGS_SUCCESS:
    case CLEAR_ALERT_NOTIFICATION:
      return action.response.result
    default:
      return state
  }
}

export const info = (state = { total: 0, count: 0 }, action) => {
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
    case TOGGLE_FAVORITE_REQUEST:
    case FETCH_ALERT_FEED_REQUEST:
      return true
    case FETCH_ALERTS_SUCCESS:
    case FETCH_ALERTS_FAILURE:
    case FETCH_LISTING_SUCCESS:
    case FETCH_LISTING_FAILURE:
    case FETCH_LISTINGS_SUCCESS:
    case FETCH_LISTINGS_FAILURE:
    case TOGGLE_FAVORITE_SUCCESS:
    case TOGGLE_FAVORITE_FAILURE:
    case FETCH_ALERT_FEED_SUCCESS:
    case FETCH_ALERT_FEED_FAILURE:
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
    case TOGGLE_FAVORITE_FAILURE:
    case ADD_ALERT_FAILURE:
    case DELETE_ALERT_FAILURE:
    case FETCH_ALERT_FEED_FAILURE:
      return action.message
    case FETCH_ALERTS_REQUEST:
    case FETCH_ALERTS_SUCCESS:
    case FETCH_LISTING_REQUEST:
    case FETCH_LISTING_SUCCESS:
    case FETCH_LISTINGS_REQUEST:
    case FETCH_LISTINGS_SUCCESS:
    case TOGGLE_FAVORITE_REQUEST:
    case TOGGLE_FAVORITE_SUCCESS:
    case FETCH_ALERT_FEED_REQUEST:
    case FETCH_ALERT_FEED_SUCCESS:
      return null
    default:
      return state
  }
}
