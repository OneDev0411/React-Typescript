import { batchActions } from 'redux-batched-actions'

import * as actionTypes from '../../../constants/contacts'
import {
  requestContactPage,
  receiveContactPage,
  clearContactPages
} from '../pagination'
import { searchContacts as search } from '../../../models/contacts/search-contacts'
import { defaultQuery } from '../../../models/contacts/helpers'

import {
  isFetchingContactsList,
  selectContactsInfo
} from '../../../reducers/contacts/list'
import { normalizeContacts } from '../helpers/normalize-contacts'

export function searchContacts(filter, page = 1, limit = 50) {
  return async (dispatch, getState) => {
    const {
      contacts: { list }
    } = getState()

    if (isFetchingContactsList(list)) {
      return Promise.resolve()
    }

    try {
      const listInfo = selectContactsInfo(list)

      if (listInfo.type === 'general' || listInfo.filter !== filter) {
        dispatch(clearContactPages)
      }

      batchActions([
        dispatch({
          type: actionTypes.SEARCH_CONTACTS_REQUEST
        }),
        dispatch(requestContactPage(page))
      ])

      const start = page - 1 > 0 ? (page - 1) * limit : 0
      const response = await search(filter, { ...defaultQuery, start, limit })

      if (listInfo.type === 'general' || listInfo.filter !== filter) {
        dispatch({
          type: actionTypes.CLEAR_CONTACTS_LIST
        })
      }

      batchActions([
        dispatch({
          response: {
            info: {
              ...response.info,
              filter,
              type: 'filter'
            },
            ...normalizeContacts(response)
          },
          type: actionTypes.SEARCH_CONTACTS_SUCCESS
        }),
        dispatch(receiveContactPage(page, response.data.map(({ id }) => id)))
      ])
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.SEARCH_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
