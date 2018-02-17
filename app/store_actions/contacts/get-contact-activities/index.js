import { normalize } from 'normalizr'
import { contactsSchema } from '../../../models/contacts/schema'
import fetchContactActivities from '../../../models/contacts/get-contact-activities'
import * as actionTypes from '../../../constants/contacts'
import { selectContact } from '../../../reducers/contacts/list'

const getContactActivities = (contactId = '') => async (dispatch, getState) => {
  if (!contactId) {
    return Promise.resolve()
  }

  try {
    dispatch({
      type: actionTypes.FETCH_CONTACT_ACTIVITIES_REQUEST
    })

    const activities = await fetchContactActivities(contactId)
    const { contacts: { list } } = getState()
    const contact = selectContact(list, contactId)
    const newContact = {
      ...contact,
      activities
    }

    const contacts = { contacts: [newContact] }
    const response = normalize(contacts, contactsSchema)

    dispatch({
      response,
      type: actionTypes.FETCH_CONTACT_ACTIVITIES_SUCCESS
    })

    return contact
  } catch (error) {
    dispatch({
      error,
      type: actionTypes.FETCH_CONTACT_ACTIVITIES_FAILURE
    })
    throw error
  }
}

export default getContactActivities
