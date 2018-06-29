import * as actionTypes from '../../constants/pagination'

function requestPage(list, page) {
  return {
    type: actionTypes.REQUEST_PAGE,
    payload: {
      page
    },
    meta: {
      list
    }
  }
}

function receivePage(list, page, ids) {
  return {
    type: actionTypes.RECEIVE_PAGE,
    payload: {
      page,
      ids
    },
    meta: {
      list
    }
  }
}

function removePage(list, page) {
  return {
    type: actionTypes.REMOVE_PAGE,
    payload: {
      page
    },
    meta: {
      list
    }
  }
}

function updatePages(list, pages) {
  return {
    type: actionTypes.UPDATE_PAGINATION,
    payload: {
      pages
    },
    meta: {
      list
    }
  }
}

function setCurrentPage(list, page) {
  return {
    type: actionTypes.SET_CURRENT_PAGE,
    payload: {
      page
    },
    meta: {
      list
    }
  }
}

function selectRow(list, page, id) {
  return {
    type: actionTypes.SELECT_ROW,
    payload: {
      page,
      id
    },
    meta: {
      list
    }
  }
}

function deselectRow(list, page, id) {
  return {
    type: actionTypes.DESELECT_ROW,
    payload: {
      page,
      id
    },
    meta: {
      list
    }
  }
}

function selectAllRows(list, page) {
  return {
    type: actionTypes.SELECT_ALL_ROWS,
    payload: {
      page
    },
    meta: {
      list
    }
  }
}

function deselectAllRows(list, page) {
  return {
    type: actionTypes.DESELECT_ALL_ROWS,
    payload: {
      page
    },
    meta: {
      list
    }
  }
}

export function clearPagination(list) {
  return {
    type: actionTypes.CLEAR_PAGINATION,
    meta: {
      list
    }
  }
}

export const createRequestPageActionCreator = list => page =>
  requestPage(list, page)

export const createReceivePageActionCreator = list => (page, ids) =>
  receivePage(list, page, ids)

export const createRemovePageActionCreator = list => page =>
  removePage(list, page)

export const createUpdatePagesActionCreator = list => pages =>
  updatePages(list, pages)

export const createCurrentPageActionCreator = list => page =>
  setCurrentPage(list, page)

export const createSelectRowActionCreator = list => (page, id) =>
  selectRow(list, page, id)

export const createDeselectRowActionCreator = list => (page, id) =>
  deselectRow(list, page, id)

export const createSelectAllRowsActionCreator = list => page =>
  selectAllRows(list, page)

export const createDeselectAllRowsActionCreator = list => page =>
  deselectAllRows(list, page)
