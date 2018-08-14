import {
  UPSERT_ATTRIBUTES_TO_CONTACTS_REQUEST,
  UPSERT_ATTRIBUTES_TO_CONTACTS_SUCCESS,
  UPSERT_ATTRIBUTES_TO_CONTACTS_FAILURE
} from '../../../constants/contacts'
import { upsertAttributesToContacts as fetchUpsertAttributesToContacts } from '../../../models/contacts/update-bulk-contacts'
import { normalizeContacts } from '../helpers/normalize-contacts'

export function upsertAttributesToContacts(ids, attributes) {
  return async dispatch => {
    try {
      dispatch({
        type: UPSERT_ATTRIBUTES_TO_CONTACTS_REQUEST
      })

      const response = await fetchUpsertAttributesToContacts(ids, attributes)

      dispatch({
        response: normalizeContacts(response),
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
