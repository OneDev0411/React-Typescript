import { IAppState } from 'reducers'

import { getActiveTeamSettings } from 'utils/user-teams'

import { isDeletedOrRevoked } from 'reducers/contacts/oAuthAccounts'

import { SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY } from '../constants'
import { getNumOfSyncedContacts } from '../ImportContactsButton/helpers'

export interface SyncedContacts {
  accounts: number
  contactsCount: number
}

export const getSyncedContacts = (state: IAppState): SyncedContacts => {
  const accounts = Object.values(state.contacts.oAuthAccounts.list)
    .flat()
    .filter(
      account =>
        isDeletedOrRevoked(account) || account.sync_status === 'success'
    )

  const lastSeen = new Date(
    getActiveTeamSettings(state.user, SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY) ||
      0
  )

  return {
    accounts: accounts.length,
    contactsCount: getNumOfSyncedContacts(lastSeen, accounts)
  }
}
