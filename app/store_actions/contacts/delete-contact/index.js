import * as actionTypes from '../../../constants/contacts'
import {
  selectContactsInfo,
  selectContacts
} from '../../../reducers/contacts/list'
import { getContacts, searchContacts } from '../index.js'
import { deleteContacts as removeContacts } from '../../../models/contacts/delete-contact'

export function deleteContacts(contactIds) {
  return async (dispatch, getState) => {
    if (!contactIds) {
      throw new Error('Contact id is required.')
    }

    try {
      dispatch({
        type: actionTypes.DELETE_CONTACTS_REQUEST
      })

      await removeContacts(contactIds)
      afterDeleteContactsFetch(dispatch, getState, contactIds)
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.DELETE_CONTACTS_FAILURE
      })
      throw error
    }
  }
}

export async function afterDeleteContactsFetch(dispatch, getState, contactIds) {
  const { list } = getState().contacts
  const listInfo = selectContactsInfo(list)
  const fetchedContactsLength = selectContacts(list).length

  if (fetchedContactsLength < listInfo.total) {
    if (listInfo.type === 'general') {
      await dispatch(getContacts(fetchedContactsLength, contactIds.length))
    } else {
      await dispatch(
        searchContacts(
          listInfo.filter,
          fetchedContactsLength,
          contactIds.length,
          listInfo.searchText
        )
      )
    }
  }

  dispatch({
    type: actionTypes.DELETE_CONTACTS_SUCCESS,
    contactIds
  })
}
