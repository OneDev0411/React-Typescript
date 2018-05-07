import { normalize } from 'normalizr'
import * as actionTypes from '../../../constants/contacts'
import { contactsSchema } from '../../../models/contacts/schema'
import fetchContacts from '../../../models/contacts/get-contacts'
import { isFetchingContactsList } from '../../../reducers/contacts/list'

export function getContacts(user = {}, params) {
  return async (dispatch, getState) => {
    if (Object.keys(user).length === 0) {
      ;({ user } = getState())
    }

    const { contacts: { list } } = getState()

    if (isFetchingContactsList(list)) {
      return Promise.resolve()
    }

    try {
      let startPoint = 0
      let limit = 1000
      let count = 0

      do {
        dispatch({
          type: actionTypes.FETCH_CONTACTS_REQUEST
        })

        let response = await fetchContacts(user, startPoint, limit)

        const { data, info } = response
        const contacts = { contacts: data }
        const normalizedData = normalize(contacts, contactsSchema)

        startPoint += limit
        count = info.total
        response = {
          info,
          ...normalizedData
        }

        dispatch({
          response,
          type: actionTypes.FETCH_CONTACTS_SUCCESS
        })
      } while (count > startPoint)
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.FETCH_CONTACTS_FAILURE
      })
      throw error
    }
  }
}

export default getContacts
