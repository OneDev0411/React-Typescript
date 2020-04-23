// TODO: refactor this file
/*
I've commented some parts of this file because of a discussion
 we had with Emil for handling the number of sync contacts.
 We should take care of it later.
*/
import { IAppState } from 'reducers'

// import { getActiveTeamSettings } from 'utils/user-teams'

import {
  isDeletedOrRevoked
  // getNumOfSyncedContacts
} from 'utils/oauth-provider'

// import { SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY } from '../constants'

export interface SyncedContacts {
  accounts: number
  // contactsCount: number
}

export const getSyncedContacts = (state: IAppState): SyncedContacts => {
  const accounts = Object.values(state.contacts.oAuthAccounts.list)
    .flat()
    .filter(
      account =>
        isDeletedOrRevoked(account) || account.sync_status === 'success'
    )

  // const lastSeen = new Date(
  //   getActiveTeamSettings(state.user, SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY) ||
  //     0
  // )

  return {
    accounts: accounts.length
    // contactsCount: getNumOfSyncedContacts(lastSeen, accounts)
  }
}
