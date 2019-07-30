import {
  FETCH_OAUTH_ACCOUNT_SUCCESS,
  OAuthProvider,
  SYNC_OAUTH_ACCOUNT_FAILURE,
  SYNC_OAUTH_ACCOUNT_REQUEST,
  SYNC_OAUTH_ACCOUNT_SUCCESS
} from 'constants/contacts'

import { Dispatch } from 'redux'

import { batchActions } from 'redux-batched-actions'

import { syncOAuthAccount as sync } from 'models/contacts/sync-o-auth-account'
import { IOAuthAccountAction } from 'reducers/contacts/oAuthAccounts'

export function syncOAuthAccount(provider: OAuthProvider, accountId: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch<IOAuthAccountAction>({
      type: SYNC_OAUTH_ACCOUNT_REQUEST,
      accountId
    })

    try {
      const updatedAccount = await sync(provider, accountId)

      batchActions([
        dispatch({
          type: SYNC_OAUTH_ACCOUNT_SUCCESS,
          accountId
        }),
        dispatch({
          account: updatedAccount,
          provider,
          type: FETCH_OAUTH_ACCOUNT_SUCCESS
        })
      ])
    } catch (error) {
      dispatch<IOAuthAccountAction>({
        type: SYNC_OAUTH_ACCOUNT_FAILURE,
        accountId,
        error
      })
    }
  }
}
