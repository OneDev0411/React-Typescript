import { getDefaultList } from 'reducers/filter-segments'
import { IAppState } from 'reducers/index'

import { getActiveTeamSettings } from 'utils/user-teams'

import { getOrganizeSyncedContactsAttributeFilters } from '../OrganizeSyncedContactsButton/helpers'
import {
  SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY,
  SYNCED_CONTACTS_LIST_ID
} from '../constants'

export const getPredefinedContactLists = (
  name,
  state: IAppState
): StringMap<ISavedSegment> => {
  const predefinedLists: StringMap<ISavedSegment<IContactAttributeFilter>> = {
    default: getDefaultList(name)
  }

  const accounts = state.contacts.googleAccounts.filter(
    account => account.sync_status === 'success'
  )
  const lastSeen = new Date(
    getActiveTeamSettings(state.user, SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY) ||
      0
  )

  const badge = accounts
    .flatMap(account => account.histories || [])
    .reduce((sum, history) => {
      if (new Date(history.updated_at) > lastSeen) {
        return sum + history.synced_contacts_num
      }

      return sum
    }, 0)

  if (accounts.length > 0) {
    predefinedLists.synced = {
      id: SYNCED_CONTACTS_LIST_ID,
      name: 'Synced Contacts',
      badge: badge > 0 ? badge : undefined,
      is_editable: false,
      filters: getOrganizeSyncedContactsAttributeFilters(
        state.contacts.attributeDefs
      )
    }
  }

  return predefinedLists
}
