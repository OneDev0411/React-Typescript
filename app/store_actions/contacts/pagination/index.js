import {
  clearPagination,
  createRemovePageActionCreator,
  createCurrentPageActionCreator,
  createRequestPageActionCreator,
  createReceivePageActionCreator,
  createUpdatePagesActionCreator
} from '../../pagination'

export const clearContactPages = clearPagination('contacts')
export const removeContactPage = createRemovePageActionCreator('contacts')
export const requestContactPage = createRequestPageActionCreator('contacts')
export const receiveContactPage = createReceivePageActionCreator('contacts')
export const updateContactPages = createUpdatePagesActionCreator('contacts')
export const setContactCurrentPage = createCurrentPageActionCreator('contacts')
