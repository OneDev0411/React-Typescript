import * as actionTypes from '../../../constants/contacts'
import { createContacts as postNewContacts } from '../../../models/contacts/create-contacts'
import { getContacts } from '../get-contacts'

export function createContacts(contacts, query) {
  return async dispatch => {
    if (!contacts) {
      const error = new Error(`contact is ${contacts}`)

      dispatch({
        error,
        type: actionTypes.CREATE_CONTACTS_FAILURE
      })
      throw error
    }

    try {
      dispatch({
        type: actionTypes.CREATE_CONTACTS_REQUEST
      })

      if (!Array.isArray(contacts)) {
        contacts = [contacts]
      }

      await postNewContacts(contacts, query)

      return dispatch(getContacts())
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.CREATE_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
