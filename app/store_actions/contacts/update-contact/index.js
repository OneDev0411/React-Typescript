import { normalize } from 'normalizr'

import { contactsSchema } from '../../../models/contacts/schema'
import * as actionTypes from '../../../constants/contacts'
import { selectContact } from '../../../reducers/contacts/list'
import { normalizeContactAttribute } from '../helpers/normalize-contacts'
import { updateContact as patchContact } from '../../../models/contacts/update-contact'

export function updateContact(contactId, attributes, query) {
  return async (dispatch, getState) => {
    if (!contactId || !Array.isArray(attributes) || attributes.length === 0) {
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

      const response = await patchContact(contactId, attributes, query)
      const updatedContact = normalizeContactAttribute(response)

      const newContact = updateContactOnStore(
        updatedContact[0],
        dispatch,
        getState
      )

      return newContact
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.PATCH_CONTACT_FAILURE
      })
      throw error
    }
  }
}

export default updateContact

export function updateContactOnStore(newContact, dispatch, getState) {
  const {
    contacts: { list }
  } = getState()
  const contact = selectContact(list, newContact.contactId)
  const updatedContact = {
    ...contact,
    ...newContact
  }

  dispatch({
    type: actionTypes.PATCH_CONTACT_SUCCESS,
    response: normalize({ contacts: [updatedContact] }, contactsSchema)
  })

  return newContact
}
