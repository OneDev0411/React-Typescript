import { normalize } from 'normalizr'
import { contactsSchema } from '../../../models/contacts/schema'
import removeContact from '../../../models/contacts/delete-contact'
import * as actionTypes from '../../../constants/contacts'
import { selectContacts } from '../../../reducers/contacts/list'

export function deleteContact(contactId) {
  return async (dispatch, getState) => {
    if (!contactId) {
      throw new Error('Contact id is required.')
    }

    try {
      dispatch({
        type: actionTypes.DELETE_CONTACT_REQUEST
      })

      await removeContact({ contactId })

      const { contacts: { list } } = getState()
      const contactsList = selectContacts(list)
      const contacts = contactsList.filter(({ id }) => id !== contactId)
      const response = normalize({ contacts }, contactsSchema)

      dispatch({
        response,
        type: actionTypes.DELETE_CONTACT_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.DELETE_CONTACT_FAILURE
      })
      throw error
    }
  }
}
