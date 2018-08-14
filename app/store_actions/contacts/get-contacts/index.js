import * as actionTypes from '../../../constants/contacts'
import { getContacts as fetchContacts } from '../../../models/contacts/get-contacts'
import { normalizeContacts } from '../helpers/normalize-contacts'

export function getContacts(start = 0, limit = 50) {
  return async dispatch => {
    if (start === 0) {
      dispatch({
        type: actionTypes.CLEAR_CONTACTS_LIST
      })
    }

    try {
      const response = await fetchContacts(start, limit)

      dispatch({
        response: {
          info: {
            ...response.info,
            type: 'general'
          },
          ...normalizeContacts(response)
        },
        type: actionTypes.FETCH_CONTACTS_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.FETCH_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
