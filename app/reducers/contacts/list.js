import { combineReducers } from 'redux'
import _ from 'underscore'

import * as actionTypes from '../../constants/contacts'
import {
  CHANGE_VIEW_AS_FILTER_REQUEST,
  CHANGE_VIEW_AS_FILTER_FAILURE
} from '../../constants/user'

const byId = (state = {}, action) => {
  switch (action.type) {
    // case actionTypes.CONTACTS__UPLOAD_CVS:
    case actionTypes.FETCH_CONTACT_SUCCESS:
    case actionTypes.PATCH_CONTACT_SUCCESS:
    case actionTypes.FETCH_CONTACTS_SUCCESS:
    case actionTypes.SEARCH_CONTACTS_SUCCESS:
    case actionTypes.DELETE_ATTRIBUTE_SUCCESS:
    case actionTypes.POST_NEW_ATTRIBUTES_SUCCESS:
    case actionTypes.FETCH_CONTACT_ACTIVITIES_SUCCESS:
    case actionTypes.UPSERT_ATTRIBUTES_TO_CONTACTS_SUCCESS:
    case actionTypes.DELETE_ATTRIBUTES_FROM_CONTACTS_SUCCESS:
      return {
        ...state,
        // ...action.response.entities.contacts
        ...state,
        ..._.mapObject(action.response.entities.contacts, contact => ({
          ...contact,
          meta: { ...action.meta }
        }))
      }

    case actionTypes.CREATE_CONTACTS_SUCCESS:
      return {
        ...action.response.entities.contacts,
        ...state
      }

    case actionTypes.DELETE_CONTACTS_SUCCESS:
      return _.omit(state, (value, key) => action.contactIds.includes(key))

    case actionTypes.UPDATE_CONTACT_TAGS:
      return {
        ...state,
        [action.contactId]: {
          ...state[action.contactId],
          tags: action.tags,
          updated_at: Date.now() / 1000
        }
      }

    case actionTypes.CLEAR_CONTACTS_LIST:
      return {}

    default:
      return state
  }
}

const ids = (state = [], action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_SUCCESS:
    case actionTypes.FETCH_CONTACTS_SUCCESS:
    case actionTypes.SEARCH_CONTACTS_SUCCESS:
    case actionTypes.UPSERT_ATTRIBUTES_TO_CONTACTS_SUCCESS:
      let newState = []

      // For adding contacts to the top
      if (action.prependResult) {
        newState = [...action.response.result.contacts, ...state]
      } else {
        newState = [...state, ...action.response.result.contacts]
      }

      // removing duplicates
      return [...new Set(newState)]

    case actionTypes.CREATE_CONTACTS_SUCCESS:
      return [...action.response.result.contacts, ...state]

    case actionTypes.DELETE_CONTACTS_SUCCESS:
      return state.filter(id => !action.contactIds.includes(id))
    case actionTypes.CLEAR_CONTACTS_LIST:
      return []
    default:
      return state
  }
}

const listInfoInitialState = {
  total: 0,
  count: 0,
  type: 'general',
  filter: [],
  searchInputValue: '',
  order: '-created_at'
}
export const info = (state = listInfoInitialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_SUCCESS:
    case actionTypes.FETCH_CONTACTS_SUCCESS:
    case actionTypes.SEARCH_CONTACTS_SUCCESS:
    case actionTypes.CREATE_CONTACTS_SUCCESS:
      return action.response.info
    case actionTypes.CLEAR_CONTACTS_LIST:
      return {
        ...listInfoInitialState,
        type: state.type
      }
    case actionTypes.UPDATE_CONTACT_LIST_INFO:
      return action.info
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_REQUEST:
    case actionTypes.SEARCH_CONTACTS_REQUEST:
    case actionTypes.FETCH_MERGE_CONTACTS_REQUEST:
    case actionTypes.UPSERT_ATTRIBUTES_TO_CONTACTS_REQUEST:
    case actionTypes.POST_NEW_ATTRIBUTES_REQUEST:
    case actionTypes.PATCH_CONTACT_REQUEST:
    case actionTypes.DELETE_CONTACTS_REQUEST:
    case CHANGE_VIEW_AS_FILTER_REQUEST:
      return true
    case actionTypes.FETCH_CONTACTS_SUCCESS:
    case actionTypes.FETCH_CONTACTS_FAILURE:
    case actionTypes.FETCH_MERGE_CONTACTS_FAILURE:
    case actionTypes.SEARCH_CONTACTS_SUCCESS:
    case actionTypes.SEARCH_CONTACTS_FAILURE:
    case actionTypes.UPSERT_ATTRIBUTES_TO_CONTACTS_SUCCESS:
    case actionTypes.DELETE_ATTRIBUTES_FROM_CONTACTS_SUCCESS:
    case actionTypes.UPSERT_ATTRIBUTES_TO_CONTACTS_FAILURE:
    case actionTypes.POST_NEW_ATTRIBUTES_SUCCESS:
    case actionTypes.POST_NEW_ATTRIBUTES_FAILURE:
    case actionTypes.PATCH_CONTACT_SUCCESS:
    case actionTypes.PATCH_CONTACT_FAILURE:
    case actionTypes.DELETE_CONTACTS_SUCCESS:
    case actionTypes.DELETE_CONTACTS_FAILURE:
    case CHANGE_VIEW_AS_FILTER_FAILURE:
      return false
    default:
      return state
  }
}

const error = (state = null, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_FAILURE:
    case actionTypes.FETCH_MERGE_CONTACTS_FAILURE:
    case actionTypes.SEARCH_CONTACTS_FAILURE:
    case actionTypes.UPSERT_ATTRIBUTES_TO_CONTACTS_FAILURE:
    case actionTypes.DELETE_CONTACTS_FAILURE:
      return action.error
    case actionTypes.FETCH_CONTACTS_SUCCESS:
    case actionTypes.SEARCH_CONTACTS_SUCCESS:
    case actionTypes.UPSERT_ATTRIBUTES_TO_CONTACTS_SUCCESS:
    case actionTypes.DELETE_ATTRIBUTES_FROM_CONTACTS_SUCCESS:
    case actionTypes.DELETE_CONTACTS_SUCCESS:
      return null
    default:
      return state
  }
}

const textFilter = (state = '', action) => {
  switch (action.type) {
    case actionTypes.SET_CONTACTS_LIST_TEXT_FILTER:
      return action.text
    default:
      return state
  }
}

const contactsList = combineReducers({
  ids,
  byId,
  info,
  error,
  textFilter,
  isFetching
})

export default contactsList

export const selectContact = (state, id) => state.byId[id]

export const selectContacts = state => state.ids.map(id => state.byId[id])

export const selectContactsInfo = state => state.info

export const selectContactsListFetching = state => state.isFetching

export const getContactsListError = state => state.error
