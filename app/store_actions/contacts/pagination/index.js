import {
  clearPagination,
  createRequestPageActionCreator,
  createReceivePageActionCreator
} from '../../pagination'

export const clearContactsPages = clearPagination('contacts')
export const requestContactPage = createRequestPageActionCreator('contacts')
export const receiveContactPage = createReceivePageActionCreator('contacts')
