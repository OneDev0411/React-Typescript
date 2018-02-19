import { normalize } from 'normalizr'
import { contactsSchema } from '../../../models/contacts/schema'
import postNewAttributes from '../../../models/contacts/post-new-attributes'
import * as actionTypes from '../../../constants/contacts'
import { selectContact } from '../../../reducers/contacts/list'

export function addNewAttributes({ contactId = '', attributes = [] }) {
  return async (dispatch, getState) => {
    if (!contactId || attributes.length === 0) {
      return Promise.resolve()
    }

    try {
      dispatch({
        type: actionTypes.POST_NEW_ATTRIBUTES_REQUEST
      })

      const updatedContact = await postNewAttributes({ contactId, attributes })
      const { contacts: { list } } = getState()
      const contact = selectContact(list, contactId)
      const newContact = {
        ...contact,
        ...updatedContact
      }

      const response = normalize({ contacts: [newContact] }, contactsSchema)

      dispatch({
        response,
        type: actionTypes.POST_NEW_ATTRIBUTES_SUCCESS
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

export default addNewAttributes
