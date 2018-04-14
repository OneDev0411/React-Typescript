import { normalize } from 'normalizr'

import { contactsSchema } from '../../../models/contacts/schema'
import * as actionTypes from '../../../constants/contacts'
import { selectContact } from '../../../reducers/contacts/list'
import { normalizeContactAttribute } from '../helpers/normalize-contacts'
import { addAttributes as createAttributes } from '../../../models/contacts/add-attributes'

export function addAttributes(contactId, attributes) {
  return async (dispatch, getState) => {
    if (!contactId || attributes.length === 0) {
      return Promise.resolve()
    }

    try {
      dispatch({
        type: actionTypes.POST_NEW_ATTRIBUTES_REQUEST
      })

      const response = await createAttributes(contactId, attributes)
      const updatedContact = normalizeContactAttribute(response)
      const { contacts: { list } } = getState()
      const contact = selectContact(list, contactId)
      const newContact = {
        ...contact,
        ...updatedContact[0]
      }

      dispatch({
        type: actionTypes.POST_NEW_ATTRIBUTES_SUCCESS,
        response: normalize({ contacts: [newContact] }, contactsSchema)
      })

      return contact
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.POST_NEW_ATTRIBUTES_FAILURE
      })
      throw error
    }
  }
}
