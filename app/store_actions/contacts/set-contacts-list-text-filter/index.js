import * as actionTypes from '../../../constants/contacts'

export const setContactsListTextFilter = text => ({
  text,
  type: actionTypes.SET_CONTACTS_LIST_TEXT_FILTER
})
