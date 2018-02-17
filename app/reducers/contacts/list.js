import { combineReducers } from 'redux'
import * as actionTypes from '../../constants/contacts'

const byId = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_SUCCESS:
    case actionTypes.FETCH_CONTACTS_SUCCESS:
    case actionTypes.POST_NEW_CONTACTS_SUCCESS:
    case actionTypes.POST_NEW_ATTRIBUTES_SUCCESS:
    case actionTypes.FETCH_CONTACT_ACTIVITIES_SUCCESS:
      return {
        ...state,
        ...action.response.entities.contacts
      }
    default:
      return state
  }
}

const ids = (state = [], action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_SUCCESS:
    case actionTypes.FETCH_CONTACTS_SUCCESS:
    case actionTypes.POST_NEW_CONTACTS_SUCCESS:
      return [...state, ...action.response.result.contacts]
    default:
      return state
  }
}

export const info = (state = { total: 0, count: 0 }, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_SUCCESS:
      return action.response.info
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_REQUEST:
      return true
    case actionTypes.FETCH_CONTACTS_SUCCESS:
    case actionTypes.FETCH_CONTACTS_FAILURE:
      return false
    default:
      return state
  }
}

const errorMessage = (state = null, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_FAILURE:
      return action.message
    case actionTypes.FETCH_CONTACTS_SUCCESS:
      return null
    default:
      return state
  }
}

const contactsList = combineReducers({
  ids,
  byId,
  info,
  isFetching,
  errorMessage
})

export default contactsList

export const selectContact = (state, id) => state.byId[id]

export const selectContacts = state => state.ids.map(id => state.byId[id])

export const getContactsinfo = state => state.info

export const isFetchingContactsList = state => state.isFetching

export const getContactsListError = state => state.errorMessage
