import { normalizeContacts } from '../helpers/normalize-contacts'
import * as actionTypes from '../../../constants/contacts'
import { deleteAttribute as removeAttribute } from '../../../models/contacts/delete-attribute'
import { getContact as fetchContact } from '../../../models/contacts/get-contact'

export function deleteAttributes(contactId, ids, query) {
  return async dispatch => {
    if (!contactId) {
      const error = new Error('ContactId is not valid!')

      return dispatch({
        error,
        type: actionTypes.DELETE_ATTRIBUTE_FAILURE
      })
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      const error = new Error('Invalid array of ids')

      return dispatch({
        error,
        type: actionTypes.DELETE_ATTRIBUTE_FAILURE
      })
    }

    try {
      dispatch({
        type: actionTypes.DELETE_ATTRIBUTE_REQUEST
      })

      let updatedContact

      if (ids.length === 1) {
        updatedContact = await removeAttribute(contactId, ids[0], query)
      } else {
        await Promise.all(
          ids.map(async attributeId => {
            await removeAttribute(contactId, attributeId)
          })
        )

        // because of parallel deletion requests,
        // when all of them will be done, updated contact will be requested.
        updatedContact = await fetchContact(contactId, query)
      }

      if (updatedContact) {
        dispatch({
          response: normalizeContacts(updatedContact),
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
