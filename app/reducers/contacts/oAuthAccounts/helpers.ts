import { negate } from 'lodash'

import { isDeletedOrRevoked } from '../../../utils/oauth-provider'

import { IOauthAccountsState } from './types'

export function selectAllConnectedAccounts(state: IOauthAccountsState) {
  return Object.values(state.list)
    .flat()
    .filter(negate(isDeletedOrRevoked))
}
