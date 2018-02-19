import { normalize } from 'normalizr'
import { contactsSchema } from '../../../models/contacts/schema'
import patchContact from '../../../models/contacts/update-contact'
import * as actionTypes from '../../../constants/contacts'
import { selectContact } from '../../../reducers/contacts/list'

const updateContact = ({ contactId = '', attributes = [] }) => async (
  dispatch,
  getState
) => {
  if (!contactId || attributes.length === 0) {
    return Promise.resolve()
  }

  try {
    dispatch({
      type: actionTypes.PATCH_CONTACT_REQUEST
    })

    const updatedContact = await patchContact({ contactId, attributes })
    const { contacts: { list } } = getState()
    const contact = selectContact(list, contactId)
    const newContact = {
      ...contact,
      ...updatedContact
    }
    const response = normalize({ contacts: [newContact] }, contactsSchema)

    dispatch({
      response,
      type: actionTypes.PATCH_CONTACT_SUCCESS
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

export default updateContact
