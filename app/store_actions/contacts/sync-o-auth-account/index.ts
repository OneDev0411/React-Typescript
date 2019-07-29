import {
  OAuthProvider,
  SYNC_OAUTH_ACCOUNT_FAILURE,
  SYNC_OAUTH_ACCOUNT_REQUEST,
  SYNC_OAUTH_ACCOUNT_SUCCESS
} from 'constants/contacts'

import { Dispatch } from 'redux'

import { syncOAuthAccount as sync } from 'models/contacts/sync-o-auth-account'
import { IOAuthAccountAction } from 'reducers/contacts/oAuthAccounts'

import { fetchOAuthAccount } from '../fetch-o-auth-account'

export function syncOAuthAccount(provider: OAuthProvider, accountId: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch<IOAuthAccountAction>({
      type: SYNC_OAUTH_ACCOUNT_REQUEST,
      accountId
    })

    try {
      await sync(provider, accountId)
      await fetchOAuthAccount(provider, accountId)(dispatch)

      dispatch<IOAuthAccountAction>({
        type: SYNC_OAUTH_ACCOUNT_SUCCESS,
        accountId
      })
    } catch (error) {
      dispatch<IOAuthAccountAction>({
        type: SYNC_OAUTH_ACCOUNT_FAILURE,
        accountId,
        error
      })
    }
  }
}
