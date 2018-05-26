import { batchActions } from 'redux-batched-actions'

import * as actionTypes from '../../../constants/contacts'
import { requestContactPage, receiveContactPage } from '../pagination'
import { getContacts as fetchContacts } from '../../../models/contacts/get-contacts'
import { isFetchingContactsList } from '../../../reducers/contacts/list'
import { normalizeContacts } from '../helpers/normalize-contacts'

export function getContacts(page = 1, limit = 50) {
  return async (dispatch, getState) => {
    const {
      contacts: { list }
    } = getState()

    if (isFetchingContactsList(list)) {
      return Promise.resolve()
    }

    try {
      batchActions([
        dispatch({
          type: actionTypes.FETCH_CONTACTS_REQUEST
        }),
        dispatch(requestContactPage(page))
      ])

      const start = page - 1 > 0 ? (page - 1) * limit : 0
      const response = await fetchContacts(start, limit)

      batchActions([
        dispatch({
          response: {
            info: {
              ...response.info,
              type: 'general'
            },
            ...normalizeContacts(response)
          },
          type: actionTypes.FETCH_CONTACTS_SUCCESS
        }),
        dispatch(receiveContactPage(page, response.data.map(({ id }) => id)))
      ])
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.FETCH_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
