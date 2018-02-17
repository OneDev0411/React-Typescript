import { normalize } from 'normalizr'
import { contactsSchema } from '../../../models/contacts/schema'
import fetchContact from '../../../models/contacts/get-contact'
import * as actionTypes from '../../../constants/contacts'

const getContact = (user = {}, contactId = '') => async (
  dispatch,
  getState
) => {
  if (Object.keys(user).length === 0) {
    ;({ user } = getState())
  }

  if (!contactId) {
    return Promise.resolve()
  }

  try {
    dispatch({
      type: actionTypes.FETCH_CONTACT_REQUEST
    })

    const contact = await fetchContact(user, contactId)
    const contacts = { contacts: [contact] }
    const response = normalize(contacts, contactsSchema)

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

export default getContact
