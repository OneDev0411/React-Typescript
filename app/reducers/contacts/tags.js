import { combineReducers } from 'redux'
import * as actionTypes from '../../constants/contacts'

const byId = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_TAGS_SUCCESS:
      return {
        ...state,
        ...action.response.entities.tags
      }
    default:
      return state
  }
}

const ids = (state = [], action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_TAGS_SUCCESS:
      return [...state, ...action.response.result.tags]
    default:
      return state
  }
}

export const info = (state = { total: 0, count: 0 }, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_TAGS_SUCCESS:
      return action.response.info
    default:
      return state
  }
}

const isFetching = (state = false, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_TAGS_REQUEST:
      return true
    case actionTypes.FETCH_CONTACTS_TAGS_SUCCESS:
    case actionTypes.FETCH_CONTACTS_TAGS_FAILURE:
      return false
    default:
      return state
  }
}

const error = (state = null, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACTS_TAGS_FAILURE:
      return action.error
    case actionTypes.FETCH_CONTACTS_TAGS_SUCCESS:
      return null
    default:
      return state
  }
}

const contactsList = combineReducers({
  ids,
  byId,
  info,
  error,
  isFetching
})

export default contactsList

export const selectTag = (state, id) => state.byId[id]

export const selectTags = state => state.ids.map(id => state.byId[id])

export const getTagsInfo = state => state.info

export const isFetchingTags = state => state.isFetching

export const selectTagsError = state => state.error
