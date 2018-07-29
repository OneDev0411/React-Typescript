import { batchActions } from 'redux-batched-actions'
import { isEqual } from 'underscore'

import * as actionTypes from '../../../constants/contacts'
import {
  requestContactPage,
  receiveContactPage,
  clearContactPages
} from '../pagination'
import { searchContacts as search } from '../../../models/contacts/search-contacts'
import { defaultQuery } from '../../../models/contacts/helpers'

import { selectContactsInfo } from '../../../reducers/contacts/list'
import { normalizeContacts } from '../helpers/normalize-contacts'

export function searchContacts(filter, page = 1, limit = 50, searchText) {
  return async (dispatch, getState) => {
    const {
      contacts: { list }
    } = getState()

    try {
      const listInfo = selectContactsInfo(list)

      if (
        !isEqual(listInfo.filter, filter) ||
        listInfo.searchText !== searchText
      ) {
        batchActions([
          dispatch(clearContactPages),
          dispatch({
            type: actionTypes.CLEAR_CONTACTS_LIST
          })
        ])
      }

      batchActions([
        dispatch({
          type: actionTypes.SEARCH_CONTACTS_REQUEST
        }),
        dispatch(requestContactPage(page))
      ])

      const start = page - 1 > 0 ? (page - 1) * limit : 0
      const response = await search(searchText, filter, {
        ...defaultQuery,
        start,
        limit,
        order: 'display_name'
      })

      batchActions([
        dispatch({
          response: {
            info: {
              ...response.info,
              searchText,
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
