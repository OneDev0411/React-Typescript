import { ThunkDispatch } from 'redux-thunk'

import { IOAuthAccountAction } from 'reducers/contacts/oAuthAccounts'

import { disconnectOAuthAccount as disconnect } from 'models/contacts/disconnect-o-auth-account'

import { OAuthProvider } from '../../../constants/contacts'
import { fetchOAuthAccounts } from '../fetch-o-auth-accounts'

export function disconnectOAuthAccount(
  provider: OAuthProvider,
  accountId: string
) {
  return async (dispatch: ThunkDispatch<any, any, IOAuthAccountAction>) => {
    await disconnect(provider, accountId)
    fetchOAuthAccounts(provider)(dispatch)
  }
}
