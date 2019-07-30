import { ThunkDispatch } from 'redux-thunk'

import { IOAuthAccountAction } from 'reducers/contacts/oAuthAccounts'

import { disconnectOAuthAccount as disconnect } from 'models/contacts/disconnect-o-auth-account'

import {
  FETCH_OAUTH_ACCOUNT_SUCCESS,
  OAuthProvider
} from '../../../constants/contacts'

export function disconnectOAuthAccount(
  provider: OAuthProvider,
  accountId: string
) {
  return async (dispatch: ThunkDispatch<any, any, IOAuthAccountAction>) => {
    // Note: this is soft delete
    const updatedAccount = await disconnect(provider, accountId)

    dispatch({
      account: updatedAccount,
      provider,
      type: FETCH_OAUTH_ACCOUNT_SUCCESS
    })
  }
}
