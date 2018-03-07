import { combineReducers } from 'redux'
import * as actionTypes from '../../constants/contacts'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_ACTIVITIES_REQUEST:
      return true
    case actionTypes.FETCH_CONTACT_ACTIVITIES_SUCCESS:
    case actionTypes.FETCH_CONTACT_ACTIVITIES_FAILURE:
      return false
    default:
      return state
  }
}

const error = (state = null, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_ACTIVITIES_FAILURE:
      return action.error
    case actionTypes.FETCH_CONTACT_ACTIVITIES_SUCCESS:
      return null
    default:
      return state
  }
}

const activities = combineReducers({
  error,
  isFetching
})

export default activities

export const isFetchingContactActivities = state => state.isFetching

export const selectContactActivitiesError = state => state.error
