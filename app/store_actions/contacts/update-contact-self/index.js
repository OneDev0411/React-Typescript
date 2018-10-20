import { normalize } from 'normalizr'

import { contactsSchema } from '../../../models/contacts/schema'
import * as actionTypes from '../../../constants/contacts'
import { selectContact } from '../../../reducers/contacts/list'
import { normalizeContactAttribute } from '../helpers/normalize-contacts'
import { updateContactSelf as patchContactSelf } from '../../../models/contacts/update-contact-self'

export function updateContactSelf(contactId, body, query) {
  return async (dispatch, getState) => {
    if (!contactId || !body) {
      const error = new Error('Invalid parameters.')

      dispatch({
        error,
        type: actionTypes.PATCH_CONTACT_FAILURE
      })
      throw error
    }

    try {
      dispatch({
        type: actionTypes.PATCH_CONTACT_REQUEST
      })

      const response = await patchContactSelf(contactId, body, query)
      const updatedContact = normalizeContactAttribute(response)
      const {
        contacts: { list }
      } = getState()
      const contact = selectContact(list, contactId)
      const newContact = {
        ...contact,
        ...updatedContact[0]
      }

      dispatch({
        type: actionTypes.PATCH_CONTACT_SUCCESS,
        response: normalize({ contacts: [newContact] }, contactsSchema)
      })

      return contact
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.PATCH_CONTACT_FAILURE
      })
      throw error
    }
  }
}
