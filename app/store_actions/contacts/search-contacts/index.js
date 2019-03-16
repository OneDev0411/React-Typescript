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
  users,
  conditionOperator = 'and',
  prependResult = false
) {
  return async (dispatch, getState) => {
    if (start === 0) {
      dispatch({
        type: actionTypes.CLEAR_CONTACTS_LIST
      })
    }

    try {
      dispatch({
        type: actionTypes.SEARCH_CONTACTS_REQUEST
      })

      const response = await search(
        searchInputValue,
        filter,
        {
          ...defaultQuery,
          start,
          limit,
          order,
          filter_type: conditionOperator
        },
        users
      )

      const contacts = selectContacts(getState().contacts.list)
      const contactsLength = contacts.length

      if (contactsLength && start === 0) {
        dispatch({
          type: actionTypes.CLEAR_CONTACTS_LIST
        })
      }

      if (prependResult) {
        dispatch({
          type: actionTypes.CLEAR_CONTACTS_LIST
        })
      }

      const itemsToPrepend = prependResult ? contacts : {}

      const normalizedContacts = normalizeContacts(response).entities.contacts

      console.log('itemsToPrepend', itemsToPrepend)
      console.log('normalizedContacts', normalizedContacts)

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

          result: {
            contacts: { ...normalizedContacts, ...itemsToPrepend }
          }
          // contacts: [...itemsToPrepend, ...normalizedContacts]
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
