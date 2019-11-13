import { negate } from 'lodash'

import { notDeleted } from '../../../utils/not-deleted'

import { IOauthAccountsState } from './types'

export function isDeletedOrRevoked(account: IOAuthAccount) {
  return !notDeleted(account) || account.revoked
}

export function selectAllConnectedAccounts(state: IOauthAccountsState) {
  return Object.values(state.list)
    .flat()
    .filter(negate(isDeletedOrRevoked))
}
