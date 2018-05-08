import * as actionTypes from '../../../constants/contacts'
import { createContacts as postNewContacts } from '../../../models/contacts/create-contacts'

export function createContacts(contacts) {
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

      const response = await postNewContacts(
        Array.isArray(contacts) ? contacts : [contacts]
      )

      return response
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.CREATE_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
