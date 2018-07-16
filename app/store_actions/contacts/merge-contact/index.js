import {
  FETCH_MERGE_CONTACTS_REQUEST,
  FETCH_MERGE_CONTACTS_FAILURE
} from '../../../constants/contacts'
import { mergeContact as patchContact } from '../../../models/contacts/merge-contact'
import { updateStoreBasedOnRemovedContacts } from '../delete-contact'

export function mergeContact(contactId, sub_contacts, query) {
  return async (dispatch, getState) => {
    if (
      !contactId ||
      !Array.isArray(sub_contacts) ||
      sub_contacts.length === 0
    ) {
      const error = new Error('Invalid parameters.')

      dispatch({
        error,
        type: FETCH_MERGE_CONTACTS_FAILURE
      })
      throw error
    }

    try {
      dispatch({
        type: FETCH_MERGE_CONTACTS_REQUEST
      })

      await patchContact(contactId, sub_contacts, query)

      updateStoreBasedOnRemovedContacts(dispatch, getState, sub_contacts)
    } catch (error) {
      dispatch({
        error,
        type: FETCH_MERGE_CONTACTS_FAILURE
      })
      throw error
    }
  }
}

export default mergeContact
