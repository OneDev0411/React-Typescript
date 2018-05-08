import * as actionTypes from '../../../constants/contacts'
import { getContacts as fetchContacts } from '../../../models/contacts/get-contacts'
import { isFetchingContactsList } from '../../../reducers/contacts/list'
import { normalizeContacts } from '../helpers/normalize-contacts'

export function getContacts() {
  return async (dispatch, getState) => {
    const { contacts: { list } } = getState()

    if (isFetchingContactsList(list)) {
      return Promise.resolve()
    }

    try {
      let start = 0
      let limit = 100
      let count = 0

      do {
        dispatch({
          type: actionTypes.FETCH_CONTACTS_REQUEST
        })

        let response = await fetchContacts(start, limit)
        const normalizedContacts = normalizeContacts(response)

        start += limit
        count = response.info.total

        response = {
          info: response.info,
          ...normalizedContacts
        }

        dispatch({
          response,
          type: actionTypes.FETCH_CONTACTS_SUCCESS
        })
      } while (count > start)
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.FETCH_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
