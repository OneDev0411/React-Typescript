import idx from 'idx'

import * as actionTypes from '../../../constants/contacts'
import { normalizeContacts } from '../helpers/normalize-contacts'
import { createContacts as postNewContacts } from '../../../models/contacts/create-contacts'
import { getContactsinfo } from '../../../reducers/contacts/list'

export function createContacts(contacts, query) {
  return async (dispatch, getState) => {
    if (!contacts) {
      const error = new Error(`contact is ${contacts}`)

      dispatch({
        error,
        type: actionTypes.CREATE_CONTACTS_FAILURE
      })
      throw error
    }

    try {
      dispatch({
        type: actionTypes.CREATE_CONTACTS_REQUEST
      })

      if (!Array.isArray(contacts)) {
        contacts = [contacts]
      }

      const response = await postNewContacts(contacts, query)

      if (idx(response, c => c.data[0].id)) {
        const info = getContactsinfo(getState().contacts.list)

        dispatch({
          response: {
            info: {
              count: 1,
              total: info.total + 1
            },
            ...normalizeContacts(response)
          },
          type: actionTypes.CREATE_CONTACTS_SUCCESS
        })
      }

      return response
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.CREATE_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
