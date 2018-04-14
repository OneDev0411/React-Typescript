import * as actionTypes from '../../../constants/contacts'
import { getContacts as fetchContacts } from '../../../models/contacts/get-contacts'
import { isFetchingContactsList } from '../../../reducers/contacts/list'
import { normalizeContacts } from '../helpers/normalize-contacts'

export function getContacts(query) {
  return async (dispatch, getState) => {
    const { contacts: { list } } = getState()

    if (isFetchingContactsList(list)) {
      return Promise.resolve()
    }

    try {
      dispatch({
        type: actionTypes.FETCH_CONTACTS_REQUEST
      })

      let response = await fetchContacts(query)
      const normalizedContacts = normalizeContacts(response)

      response = {
        info: response.info,
        ...normalizedContacts
      }

      dispatch({
        response,
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
