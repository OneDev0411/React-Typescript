import {
  UPSERT_ATTRIBUTES_TO_CONTACTS_REQUEST,
  UPSERT_ATTRIBUTES_TO_CONTACTS_SUCCESS,
  UPSERT_ATTRIBUTES_TO_CONTACTS_FAILURE
} from '../../../constants/contacts'
import { upsertAttributesToContacts as fetchUpsertAttributesToContacts } from '../../../models/contacts/update-bulk-contacts'

export function upsertAttributesToContacts(ids, attributes) {
  return async dispatch => {
    try {
      dispatch({
        type: UPSERT_ATTRIBUTES_TO_CONTACTS_REQUEST
      })

      await fetchUpsertAttributesToContacts(ids, attributes)
      dispatch({
        type: UPSERT_ATTRIBUTES_TO_CONTACTS_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: UPSERT_ATTRIBUTES_TO_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
