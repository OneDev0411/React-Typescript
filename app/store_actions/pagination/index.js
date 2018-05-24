const requestPage = (resultKey, page) => ({
  type: 'REQUEST_PAGE',
  payload: {
    page
  },
  meta: {
    resultKey
  }
})

const receivePage = (resultKey, page, ids) => ({
  type: 'RECEIVE_PAGE',
  payload: {
    page,
    ids
  },
  meta: {
    resultKey
  }
})

export const createRequestPageActionCreator = resultKey => page =>
  requestPage(resultKey, page)

export const createReceivePageActionCreator = resultKey => (page, ids) =>
  receivePage(resultKey, page, ids)
