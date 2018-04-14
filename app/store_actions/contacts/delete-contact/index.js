import { normalize } from 'normalizr'

import { contactsSchema } from '../../../models/contacts/schema'
import * as actionTypes from '../../../constants/contacts'
import { selectContacts } from '../../../reducers/contacts/list'
import { deleteContacts as removeContacts } from '../../../models/contacts/delete-contact'

export function deleteContacts(contactIds) {
  return async (dispatch, getState) => {
    if (!contactIds) {
      throw new Error('Contact id is required.')
    }

    try {
      dispatch({
        type: actionTypes.DELETE_CONTACT_REQUEST
      })

      await removeContacts(contactIds)

      const { contacts: { list } } = getState()
      const contactsList = selectContacts(list)
      const contacts = contactsList.filter(({ id }) => !contactIds.includes(id))
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
