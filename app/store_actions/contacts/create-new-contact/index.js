import { normalize } from 'normalizr'
import { contactsSchema } from '../../../models/contacts/schema'
import postNewContact from '../../../models/contacts/post-new-contact'
import * as actionTypes from '../../../constants/contacts'
import { normalizeNewContact } from './normalize-new-contact'

const createNewContact = (formData = {}) => async dispatch => {
  if (Object.keys(formData).length === 0) {
    return Promise.resolve()
  }

  try {
    dispatch({
      type: actionTypes.POST_NEW_CONTACTS_REQUEST
    })

    const contacts = await postNewContact(normalizeNewContact(formData))
    const response = normalize({ contacts }, contactsSchema)

    dispatch({
      response,
      type: actionTypes.POST_NEW_CONTACTS_SUCCESS
    })

    return contacts[0]
  } catch (error) {
    dispatch({
      error,
      type: actionTypes.POST_NEW_CONTACTS_FAILURE
    })
    throw error
  }
}

export default createNewContact
