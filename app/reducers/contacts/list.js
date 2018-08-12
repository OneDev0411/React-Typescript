import { combineReducers } from 'redux'
import _ from 'underscore'
import * as actionTypes from '../../constants/contacts'

const byId = (state = {}, action) => {
  switch (action.type) {
    // case actionTypes.CONTACTS__UPLOAD_CVS:
    case actionTypes.FETCH_CONTACT_SUCCESS:
    case actionTypes.PATCH_CONTACT_SUCCESS:
    case actionTypes.FETCH_CONTACTS_SUCCESS:
    case actionTypes.SEARCH_CONTACTS_SUCCESS:
    case actionTypes.DELETE_ATTRIBUTE_SUCCESS:
    case actionTypes.CREATE_CONTACTS_SUCCESS:
    case actionTypes.POST_NEW_ATTRIBUTES_SUCCESS:
    case actionTypes.FETCH_CONTACT_ACTIVITIES_SUCCESS:
    case actionTypes.UPSERT_ATTRIBUTES_TO_CONTACTS_SUCCESS:
    case actionTypes.DELETE_ATTRIBUTES_FROM_CONTACTS_SUCCESS:
      return {
        ...state,
        ...action.response.entities.contacts
      }

    case actionTypes.DELETE_CONTACTS_SUCCESS:
      return _.omit(state, (value, key) => action.contactIds.includes(key))

    case actionTypes.CLEAR_CONTACTS_LIST:
      return {}
    default:
      return state
  }
}

const ids = (state = [], action) => {
  switch (action.type) {
    // case actionTypes.CONTACTS__UPLOAD_CVS:
    case actionTypes.FETCH_CONTACT_SUCCESS:
    case actionTypes.FETCH_CONTACTS_SUCCESS:
    case actionTypes.SEARCH_CONTACTS_SUCCESS:
    case actionTypes.CREATE_CONTACTS_SUCCESS:
    case actionTypes.UPSERT_ATTRIBUTES_TO_CONTACTS_SUCCESS:
      const newState = [...state, ...action.response.result.contacts]

      // removing duplicates
      return [...new Set(newState)]

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
  searchInputValue: ''
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

const filters = (state = { text: '' }, action) => {
  switch (action.type) {
    case actionTypes.SET_CONTACT_FILTERS:
      return {
        ...state,
        ...action.filters
      }
    default:
      return state
  }
}

const contactsList = combineReducers({
  ids,
  byId,
  info,
  error,
  filters,
  isFetching
})

export default contactsList

export const selectContact = (state, id) => state.byId[id]

export const selectContacts = state => state.ids.map(id => state.byId[id])

export const selectContactsInfo = state => state.info

export const selectContactsListFetching = state => state.isFetching

export const getContactsListError = state => state.error

export const selectContactFilters = state => state.filters

// export const selectPage = (state, page) => state.pagination.pages[page]

// export const selectPageContacts = (state, page) => {
//   if (state.pagination.pages[page]) {
//     return state.pagination.pages[page].ids.map(id => state.byId[id])
//   }

//   return []
// }

// export const selectPages = state => state.pagination.pages

// export const selectCurrentPage = state => state.pagination.currentPage
