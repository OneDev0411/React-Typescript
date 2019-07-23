import { getOAuthAccounts } from '../../../models/contacts/get-o-auth-accounts'

import * as actionTypes from '../../../constants/contacts'
import { OAuthProvider } from '../../../constants/contacts'

export type IOAuthAccountAction =
  | {
      type: typeof actionTypes.FETCH_OAUTH_ACCOUNTS_REQUEST
      provider: OAuthProvider
    }
  | {
      type: typeof actionTypes.FETCH_OAUTH_ACCOUNTS_SUCCESS
      provider: OAuthProvider
      accounts: IOAuthAccount[]
    }
export function fetchOAuthAccounts(provider: OAuthProvider) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_OAUTH_ACCOUNTS_REQUEST,
        provider
      })

      const accounts = await getOAuthAccounts(provider, true)

      dispatch({
        accounts,
        provider,
        type: actionTypes.FETCH_OAUTH_ACCOUNTS_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        provider,
        type: actionTypes.FETCH_OAUTH_ACCOUNTS_FAILURE
      })
      throw error
    }
  }
}
