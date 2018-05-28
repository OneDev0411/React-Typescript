import * as actionTypes from '../../constants/pagination'

const requestPage = (list, page) => ({
  type: actionTypes.REQUEST_PAGE,
  payload: {
    page
  },
  meta: {
    list
  }
})

const receivePage = (list, page, ids) => ({
  type: actionTypes.RECEIVE_PAGE,
  payload: {
    page,
    ids
  },
  meta: {
    list
  }
})

const removePage = (list, page) => ({
  type: actionTypes.REMOVE_PAGE,
  payload: {
    page
  },
  meta: {
    list
  }
})

const setCurrentPage = (list, page) => ({
  type: actionTypes.SET_CURRENT_PAGE,
  payload: {
    page
  },
  meta: {
    list
  }
})

export const clearPagination = list => ({
  type: actionTypes.CLEAR_PAGINATION,
  meta: {
    list
  }
})

export const createRequestPageActionCreator = list => page =>
  requestPage(list, page)

export const createReceivePageActionCreator = list => (page, ids) =>
  receivePage(list, page, ids)

export const createRemovePageActionCreator = list => page =>
  removePage(list, page)

export const createCurrentPageActionCreator = list => page =>
  setCurrentPage(list, page)
