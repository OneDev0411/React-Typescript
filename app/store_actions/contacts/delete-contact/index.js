import * as actionTypes from '../../../constants/contacts'
import {
  selectContacts,
  selectContactsInfo
} from '../../../reducers/contacts/list'
import { searchContacts } from '../search-contacts'
import { getContacts } from '../get-contacts'
import { deleteContacts as removeContacts } from '../../../models/contacts/delete-contact'
import { viewAs } from '../../../utils/user-teams'
import { PARKED_CONTACTS_LIST_ID } from '../../../components/Pages/Dashboard/Contacts/List/constants'

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
  const state = getState()
  const { list } = state.contacts
  const listInfo = selectContactsInfo(list)
  const fetchedContactsLength = selectContacts(list).length
  const limitFetchContact = contactIds.length > 50 ? 50 : contactIds.length
  const isParkedContactActive =
    state.contacts?.filterSegments?.activeSegmentId === PARKED_CONTACTS_LIST_ID

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
          isParkedContactActive,
          listInfo.searchText,
          undefined,
          viewAs(state.user)
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
