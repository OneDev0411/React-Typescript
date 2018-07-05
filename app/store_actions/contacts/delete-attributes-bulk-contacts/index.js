import {
  DELETE_ATTRIBUTES_FROM_CONTACTS_FAILURE,
  DELETE_ATTRIBUTES_FROM_CONTACTS_REQUEST,
  DELETE_ATTRIBUTES_FROM_CONTACTS_SUCCESS
} from '../../../constants/contacts'
import { deleteAttributesFromContacts as fetchDeleteAttributesFromContacts } from '../../../models/contacts/delete-attributes-bulk-contacts'

export function deleteAttributesFromContacts(ids) {
  return async dispatch => {
    try {
      dispatch({
        type: DELETE_ATTRIBUTES_FROM_CONTACTS_REQUEST
      })
      await fetchDeleteAttributesFromContacts(ids)
      dispatch({
        type: DELETE_ATTRIBUTES_FROM_CONTACTS_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: DELETE_ATTRIBUTES_FROM_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
