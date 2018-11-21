import * as actionTypes from '../../../constants/contacts'
import { searchContacts as search } from '../../../models/contacts/search-contacts'
import { defaultQuery } from '../../../models/contacts/helpers'

import { normalizeContacts } from '../helpers/normalize-contacts'
import { selectContacts } from '../../../reducers/contacts/list'

export function searchContacts(
  filter,
  start = 0,
  limit = 50,
  searchInputValue,
  order = '-created_at',
  users
) {
  return async (dispatch, getState) => {
    if (start === 0) {
      dispatch({
        type: actionTypes.CLEAR_CONTACTS_LIST
      })
    }

    try {
      const response = await search(
        searchInputValue,
        filter,
        {
          ...defaultQuery,
          start,
          limit,
          order
        },
        users
      )

      const contactsLength = selectContacts(getState().contacts.list).length

      if (contactsLength && start === 0) {
        dispatch({
          type: actionTypes.CLEAR_CONTACTS_LIST
        })
      }

      dispatch({
        response: {
          info: {
            ...response.info,
            searchInputValue,
            order,
            users,
            filter,
            type: 'filter'
          },
          ...normalizeContacts(response)
        },
        type: actionTypes.SEARCH_CONTACTS_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.SEARCH_CONTACTS_FAILURE
      })
      throw error
    }
  }
}
