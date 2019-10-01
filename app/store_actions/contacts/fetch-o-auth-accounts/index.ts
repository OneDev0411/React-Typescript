import { batchActions } from 'redux-batched-actions'

import { getOAuthAccounts } from '../../../models/o-auth-accounts/get-o-auth-accounts'

import * as actionTypes from '../../../constants/contacts'
import { OAuthProvider } from '../../../constants/contacts'

export function fetchOAuthAccounts(provider?: OAuthProvider) {
  if (!provider) {
    return async dispatch => {
      return batchActions([
        await dispatch(fetchOAuthAccounts(OAuthProvider.Outlook)),
        await dispatch(fetchOAuthAccounts(OAuthProvider.Google))
      ])
    }
  }

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
