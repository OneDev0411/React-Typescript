import { combineReducers } from 'redux'

import * as actionTypes from '../../constants/pagination'

const INITIAL_STATE = { pages: {}, currentPage: 0 }

const pages = (state = {}, action = {}) => {
  switch (action.type) {
    case actionTypes.REQUEST_PAGE:
      return {
        ...state,
        [action.payload.page]: {
          ids: [],
          selectedIds: [],
          fetching: true
        }
      }

    case actionTypes.RECEIVE_PAGE:
      return {
        ...state,
        [action.payload.page]: {
          ids: action.payload.ids,
          selectedIds: [],
          fetching: false
        }
      }

    case actionTypes.REMOVE_PAGE:
      return {
        ...state,
        [action.payload.page]: undefined
      }

    case actionTypes.UPDATE_PAGINATION:
      return action.payload.pages

    case actionTypes.CLEAR_PAGINATION:
      return {}

    case actionTypes.SELECT_ROW: {
      const page = state[action.payload.page]

      return {
        ...state,
        [action.payload.page]: {
          ...page,
          selectedIds: [...page.selectedIds, action.payload.id]
        }
      }
    }
    case actionTypes.DESELECT_ROW:
      return {
        ...state,
        [action.payload.page]: {
          ...state[action.payload.page],
          selectedIds: state[action.payload.page].selectedIds.filter(
            id => action.payload.id !== id
          )
        }
      }
    case actionTypes.SELECT_ALL_ROWS:
      return {
        ...state,
        [action.payload.page]: {
          ...state[action.payload.page],
          selectedIds: state[action.payload.page].ids
        }
      }
    case actionTypes.DESELECT_ALL_ROWS:
      return {
        ...state,
        [action.payload.page]: {
          ...state[action.payload.page],
          selectedIds: []
        }
      }

    default:
      return state
  }
}

const currentPage = (state = 1, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_PAGE:
    case actionTypes.REQUEST_PAGE:
      return action.payload.page

    case actionTypes.CLEAR_PAGINATION:
      return 1

    default:
      return state
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
