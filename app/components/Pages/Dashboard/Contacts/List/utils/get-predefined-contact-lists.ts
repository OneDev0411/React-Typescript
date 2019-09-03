import { uniq } from 'lodash'

import { getDefaultList } from 'reducers/filter-segments'
import { IAppState } from 'reducers/index'

import { getActiveTeamSettings } from 'utils/user-teams'

import { isDeletedOrRevoked } from 'reducers/contacts/oAuthAccounts'

import { getOrganizeSyncedContactsList } from '../OrganizeSyncedContactsButton/helpers'
import {
  SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY,
  SYNCED_CONTACTS_LIST_ID
} from '../constants'
import { getNumOfSyncedContacts } from '../ImportContactsButton/helpers'
import { oAuthAccountTypeToProvider } from '../../../Account/ConnectedAccounts/consants'

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
    .filter(
      account =>
        isDeletedOrRevoked(account) || account.sync_status === 'success'
    )

  const lastSeen = new Date(
    getActiveTeamSettings(state.user, SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY) ||
    0 // eslint-disable-line
  )

  const badge = getNumOfSyncedContacts(lastSeen, accounts)

  if (accounts.length > 0) {
    predefinedLists.synced = {
      id: SYNCED_CONTACTS_LIST_ID,
      name: 'Synced Contacts',
      badge: badge > 0 ? badge : undefined,
      is_editable: false,
      ...getOrganizeSyncedContactsList(
        state.contacts.attributeDefs,
        uniq(
          accounts
            .map(account => oAuthAccountTypeToProvider[account.type])
            .filter(i => i)
        )
      )
    }
  }

  return predefinedLists
}
