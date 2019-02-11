import * as actionTypes from '../../../constants/contacts'
import {
  selectContactsInfo,
  selectContacts
} from '../../../reducers/contacts/list'
import { getContacts, searchContacts } from '../index.js'
import { deleteContacts as removeContacts } from '../../../models/contacts/delete-contact'
import { viewAs } from '../../../utils/user-teams'

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
      await afterDeleteContactsFetch(dispatch, getState, contactIds)
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
  const limitFetchContact = contactIds.length > 50 ? 50 : contactIds.length

  if (fetchedContactsLength < listInfo.total) {
    const startPoint =
      fetchedContactsLength - contactIds.length > 0
        ? fetchedContactsLength - contactIds.length
        : 0

    if (listInfo.type === 'general') {
      await dispatch(getContacts(fetchedContactsLength, limitFetchContact))
    } else {
      await dispatch(
        searchContacts(
          listInfo.filter,
          startPoint,
          limitFetchContact,
          listInfo.searchText,
          undefined,
          viewAs(getState().user)
        )
      )
    }
  } else {
    dispatch({
      info: {
        ...listInfo,
        total: listInfo.total - contactIds.length
      },
      type: actionTypes.UPDATE_CONTACT_LIST_INFO
    })
  }

  dispatch({
    type: actionTypes.DELETE_CONTACTS_SUCCESS,
    contactIds
  })
}
