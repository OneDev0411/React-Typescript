import { getDefaultList } from 'reducers/filter-segments'
import { IAppState } from 'reducers'

import { isDeletedOrRevoked } from 'utils/oauth-provider'

import {
  PARKED_CONTACTS_LIST_ID,
  DUPLICATE_CONTACTS_LIST_ID
} from '../constants'

export const getPredefinedContactLists = (
  name,
  state: IAppState,
  includeDefaultList = true
): StringMap<ISavedSegment> => {
  const predefinedLists: StringMap<ISavedSegment<IContactAttributeFilter>> = {}

  if (includeDefaultList) {
    predefinedLists.default = getDefaultList(name)
  }

  const accounts = Object.values(state.contacts.oAuthAccounts.list)
    .flat()
    .filter(account => !isDeletedOrRevoked(account))

  if (accounts.length > 0) {
    predefinedLists.parked = {
      id: PARKED_CONTACTS_LIST_ID,
      name: 'Parked Contacts',
      is_editable: false,
      filters: []
    }
  }

  predefinedLists.duplicates = {
    id: DUPLICATE_CONTACTS_LIST_ID,
    name: 'Duplicates',
    is_editable: false,
    filters: []
  }

  return predefinedLists
}
