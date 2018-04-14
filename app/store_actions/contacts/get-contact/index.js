import { getContact as fetchContact } from '../../../models/contacts/get-contact'
import * as actionTypes from '../../../constants/contacts'
import { normalizeContacts } from '../helpers/normalize-contacts'

export function getContact(contactId) {
  return async dispatch => {
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

      let response = await fetchContact(contactId)

      response = normalizeContacts(response)

      dispatch({
        response,
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
