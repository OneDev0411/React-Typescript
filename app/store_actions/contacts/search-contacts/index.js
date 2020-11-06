import * as actionTypes from '../../../constants/contacts'
import { searchContacts as search } from '../../../models/contacts/search-contacts'
import { associations as defaultAssociations } from '../../../models/contacts/helpers'

import { normalizeContacts } from '../helpers/normalize-contacts'
import { selectContacts } from '../../../reducers/contacts/list'

// TODO: make args an object
export function searchContacts(
  attributeFilters,
  start = 0,
  limit = 50,
  parked = false,
  searchInputValue,
  order = '-created_at',
  users,
  conditionOperator = 'and',
  prependResult = false,
  meta = {},
  flows = [],
  crmTasks = [],
  alphabet
) {
  return async (dispatch, getState) => {
    if (start === 0 && !prependResult) {
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
        attributeFilters,
        {
          start,
          limit,
          parked,
          order,
          alphabet,
          filter_type: conditionOperator,
          associations: [...defaultAssociations, 'contact.flows']
        },
        users,
        flows,
        crmTasks
      )

      const contactsLength = selectContacts(getState().contacts.list).length

      if (contactsLength && start === 0 && !prependResult) {
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
            filter: attributeFilters,
            type: 'attributeFilters'
          },
          ...normalizeContacts(response)
        },
        type: actionTypes.SEARCH_CONTACTS_SUCCESS,
        prependResult,
        meta
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
