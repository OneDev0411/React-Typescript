import { combineReducers } from 'redux'

import * as actionTypes from '../../constants/pagination'

const INITIAL_STATE = { pages: {}, currentPage: 0 }

const pages = (pages = {}, action = {}) => {
  switch (action.type) {
    case actionTypes.REQUEST_PAGE:
      return {
        ...pages,
        [action.payload.page]: {
          ids: [],
          fetching: true
        }
      }
    case actionTypes.RECEIVE_PAGE: {
      return {
        ...pages,
        [action.payload.page]: {
          ids: action.payload.ids,
          fetching: false
        }
      }
    }
    case actionTypes.REMOVE_PAGE: {
      return {
        ...pages,
        [action.payload.page]: undefined
      }
    }
    case actionTypes.CLEAR_PAGINATION:
      return {}
    default:
      return pages
  }
}

const currentPage = (currentPage = 1, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_PAGE:
    case actionTypes.REQUEST_PAGE:
      return action.payload.page
    case actionTypes.CLEAR_PAGINATION:
      return 1
    default:
      return currentPage
  }
}

function createPaginationReducer(list) {
  const onlyForKey = reducer => (state = INITIAL_STATE, action = {}) => {
    if (typeof action.meta === 'undefined') {
      return state
    }

    if (action.meta.list === list) {
      return reducer(state, action)
    }

    return state
  }

  return onlyForKey(
    combineReducers({
      pages,
      currentPage
    })
  )
}

export const contactPagination = createPaginationReducer('contacts')
