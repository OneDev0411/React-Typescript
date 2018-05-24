import {
  createRequestPageActionCreator,
  createReceivePageActionCreator
} from '../../pagination'

export const requestContactPage = createRequestPageActionCreator('contacts')
export const receiveContactPage = createReceivePageActionCreator('contacts')
