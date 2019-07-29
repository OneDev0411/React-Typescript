import { getDefaultList } from 'reducers/filter-segments'
import { IAppState } from 'reducers/index'

import { getActiveTeamSettings } from 'utils/user-teams'

import { getOrganizeSyncedContactsList } from '../OrganizeSyncedContactsButton/helpers'
import {
  SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY,
  SYNCED_CONTACTS_LIST_ID
} from '../constants'
import { getNumOfSyncedContacts } from '../ImportContactsButton/helpers'

export const getPredefinedContactLists = (
  name,
  state: IAppState
): StringMap<ISavedSegment> => {
  const predefinedLists: StringMap<ISavedSegment<IContactAttributeFilter>> = {
    default: getDefaultList(name)
  }

  const accounts = Object.values(state.contacts.oAuthAccounts.list)
    .flat()
    .filter(account => account.sync_status === 'success')

  const lastSeen = new Date(
    getActiveTeamSettings(state.user, SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY) ||
      0
  )

  const badge = getNumOfSyncedContacts(lastSeen, accounts)

  if (accounts.length > 0) {
    predefinedLists.synced = {
      id: SYNCED_CONTACTS_LIST_ID,
      name: 'Synced Contacts',
      badge: badge > 0 ? badge : undefined,
      is_editable: false,
      ...getOrganizeSyncedContactsList(state.contacts.attributeDefs)
    }
  }

  return predefinedLists
}
