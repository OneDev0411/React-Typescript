import { combineReducers } from 'redux'

const pages = (pages = {}, action = {}) => {
  switch (action.type) {
    case 'REQUEST_PAGE':
      return {
        ...pages,
        [action.payload.page]: {
          ids: [],
          fetching: true
        }
      }
    case 'RECEIVE_PAGE': {
      return {
        ...pages,
        [action.payload.page]: {
          ids: action.payload.ids,
          fetching: false
        }
      }
    }
    default:
      return pages
  }
}

const currentPage = (currentPage = 0, action = {}) =>
  action.type === 'REQUEST_PAGE' ? action.payload.page : currentPage

function createPaginationReducer(resultKey) {
  const onlyForKey = reducer => (
    state = { pages: {}, currentPage: 0 },
    action = {}
  ) => {
    if (typeof action.meta === 'undefined') {
      return state
    }

    if (action.meta.resultKey === resultKey) {
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
