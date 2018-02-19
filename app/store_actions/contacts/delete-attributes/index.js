import { normalize } from 'normalizr'
import { contactsSchema } from '../../../models/contacts/schema'
import fetchContact from '../../../models/contacts/get-contact'
import removeAttribute from '../../../models/contacts/delete-attribute'
import * as actionTypes from '../../../constants/contacts'
import { selectContact } from '../../../reducers/contacts/list'

export function deleteAttributes({ contactId = '', attributesIds = [] }) {
  return async (dispatch, getState) => {
    if (!contactId) {
      return Promise.reject()
    }

    if (attributesIds.length === 0) {
      return Promise.reject()
    }

    try {
      dispatch({
        type: actionTypes.DELETE_ATTRIBUTE_REQUEST
      })

      let updatedContact

      if (attributesIds.length === 1) {
        const [attributeId] = attributesIds

        updatedContact = await removeAttribute({ contactId, attributeId })
      } else {
        await Promise.all(
          attributesIds.map(async attributeId => {
            await removeAttribute({ contactId, attributeId })
          })
        )

        const { user } = getState()

        // because of parallel deletion requests,
        // when all of them will be done, updated contact will be requested.
        updatedContact = await fetchContact(user, contactId)
      }

      if (updatedContact) {
        const { contacts: { list } } = getState()
        const contact = selectContact(list, contactId)
        const newContact = {
          ...contact,
          ...updatedContact
        }

        const response = normalize({ contacts: [newContact] }, contactsSchema)

        dispatch({
          response,
          type: actionTypes.DELETE_ATTRIBUTE_SUCCESS
        })
      } else {
        dispatch({
          error: { message: 'Something went wrong!' },
          type: actionTypes.DELETE_ATTRIBUTE_FAILURE
        })
      }
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.DELETE_ATTRIBUTE_FAILURE
      })
      throw error
    }
  }
}

export default deleteAttributes
