import { IAppState } from 'reducers'

import { isDeletedOrRevoked } from 'utils/oauth-provider'

export interface SyncedContacts {
  accounts: number
}

export const getSyncedContacts = (state: IAppState): SyncedContacts => {
  const accounts = Object.values(state.contacts.oAuthAccounts.list)
    .flat()
    .filter(account => isDeletedOrRevoked(account))

  return {
    accounts: accounts.length
  }
}
