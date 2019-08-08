import { ThunkDispatch } from 'redux-thunk'

import { getOAuthAccount } from 'models/contacts/get-o-auth-account'

import { IOAuthAccountAction } from 'reducers/contacts/oAuthAccounts'

import * as actionTypes from '../../../constants/contacts'
import { OAuthProvider } from '../../../constants/contacts'

export function fetchOAuthAccount(provider: OAuthProvider, accountId: string) {
  return async (dispatch: ThunkDispatch<any, any, IOAuthAccountAction>) => {
    try {
      dispatch({
        type: actionTypes.FETCH_OAUTH_ACCOUNT_REQUEST,
        provider,
        accountId
      })

      const account = await getOAuthAccount(provider, accountId, true)

      dispatch({
        account,
        provider,
        type: actionTypes.FETCH_OAUTH_ACCOUNT_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        provider,
        accountId,
        type: actionTypes.FETCH_OAUTH_ACCOUNT_FAILURE
      })
      throw error
    }
  }
}
