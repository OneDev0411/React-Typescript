import * as actionTypes from '../../../constants/contacts'
import { normalizeContacts } from '../helpers/normalize-contacts'
import { selectContactsInfo } from '../../../reducers/contacts/list'
import { getContact as fetchContact } from '../../../models/contacts/get-contact'

export function getContact(contactId, query) {
  return async (dispatch, getState) => {
    if (!contactId) {
      const error = new Error('Contact id is required.')

      dispatch({
        error,
        type: actionTypes.FETCH_CONTACT_FAILURE
      })

      throw error
    }

    try {
      dispatch({
        type: actionTypes.FETCH_CONTACT_REQUEST
      })

      let response = await fetchContact(contactId, query)

      const listInfo = selectContactsInfo(getState().contacts.list)
      const info = {
        ...listInfo,
        total: listInfo.total + 1
      }

      dispatch({
        response: {
          info,
          ...normalizeContacts(response)
        },
        type: actionTypes.FETCH_CONTACT_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.FETCH_CONTACT_FAILURE
      })
      throw error
    }
  }
}
