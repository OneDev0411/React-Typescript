import { addNotification as notify } from 'components/notification'
import { batchActions } from 'redux-batched-actions'

import {
  FETCH_MERGE_CONTACTS_REQUEST,
  FETCH_MERGE_CONTACTS_FAILURE
} from '../../../constants/contacts'
import { mergeContact as postMergeContacts } from '../../../models/contacts/merge-contact'
import { afterDeleteContactsFetch } from '../delete-contact'

export function mergeContact(contactId, sub_contacts) {
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

      await postMergeContacts(contactId, sub_contacts)

      await afterDeleteContactsFetch(dispatch, getState, sub_contacts)
      dispatch(
        notify({
          message: 'The contacts have been successfully merged!',
          status: 'success'
        })
      )
    } catch (error) {
      console.log(error)

      batchActions([
        dispatch({
          error,
          type: FETCH_MERGE_CONTACTS_FAILURE
        }),
        dispatch(
          notify({
            title: error.message,
            message:
              error.response && error.response.body
                ? error.response.body.message
                : null,
            status: 'error'
          })
        )
      ])
    }
  }
}

export default mergeContact
