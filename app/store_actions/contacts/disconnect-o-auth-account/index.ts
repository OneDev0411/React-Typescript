import { ThunkDispatch } from 'redux-thunk'

import { disconnectOAuthAccount as disconnect } from 'models/o-auth-accounts/disconnect-o-auth-account'
import { IOAuthAccountAction } from 'reducers/contacts/oAuthAccounts'

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
