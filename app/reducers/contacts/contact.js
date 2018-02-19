import { combineReducers } from 'redux'
import * as actionTypes from '../../constants/contacts'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_REQUEST:
      return true
    case actionTypes.FETCH_CONTACT_SUCCESS:
    case actionTypes.FETCH_CONTACT_FAILURE:
      return false
    default:
      return state
  }
}

const error = (state = null, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_FAILURE:
      return action.error
    case actionTypes.FETCH_CONTACT_SUCCESS:
      return null
    default:
      return state
  }
}

const contact = combineReducers({
  error,
  isFetching
})

export default contact

export const isFetchingContact = state => state.isFetching

export const selectContactError = state => state.error
