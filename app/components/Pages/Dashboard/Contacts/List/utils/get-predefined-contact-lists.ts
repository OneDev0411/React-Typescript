import { getDefaultList } from 'reducers/filter-segments'
import { IAppState } from 'reducers/index'

import { getOrganizeSyncedContactsAttributeFilters } from '../OrganizeSyncedContactsButton/helpers'

export const getPredefinedContactLists = (
  name,
  state: IAppState
): StringMap<ISavedSegment> => {
  const predefinedLists: StringMap<ISavedSegment<IContactAttributeFilter>> = {
    default: getDefaultList(name)
  }

  const accounts = state.contacts.googleAccounts

  if (accounts.length > 0) {
    predefinedLists.synced = {
      id: 'synced',
      name: 'Synced Contacts',
      is_editable: false,
      filters: getOrganizeSyncedContactsAttributeFilters(
        state.contacts.attributeDefs
      )
    }
  }

  return predefinedLists
}
