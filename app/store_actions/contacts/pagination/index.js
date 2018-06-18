import {
  clearPagination,
  createRemovePageActionCreator,
  createCurrentPageActionCreator,
  createRequestPageActionCreator,
  createReceivePageActionCreator,
  createUpdatePagesActionCreator,
  createSelectRowActionCreator,
  createDeselectRowActionCreator,
  createSelectAllRowsActionCreator,
  createDeselectAllRowsActionCreator
} from '../../pagination'

export const clearContactPages = clearPagination('contacts')
export const removeContactPage = createRemovePageActionCreator('contacts')
export const requestContactPage = createRequestPageActionCreator('contacts')
export const receiveContactPage = createReceivePageActionCreator('contacts')
export const updateContactPages = createUpdatePagesActionCreator('contacts')
export const setContactCurrentPage = createCurrentPageActionCreator('contacts')
export const selectRow = createSelectRowActionCreator('contacts')
export const deselectRow = createDeselectRowActionCreator('contacts')
export const selectAllRows = createSelectAllRowsActionCreator('contacts')
export const deselectAllRows = createDeselectAllRowsActionCreator('contacts')
