import { getGoogleAccounts as fetchGoogleAccounts } from 'models/contacts/get-google-accounts'

import * as actionTypes from '../../../constants/contacts'

export type IGoogleAccountActions =
  | { type: typeof actionTypes.FETCH_GOOGLE_ACCOUNTS_REQUEST }
  | {
      type: typeof actionTypes.FETCH_GOOGLE_ACCOUNTS_SUCCESS
      accounts: IGoogleAccount[]
    }
export function getGoogleAccounts() {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_GOOGLE_ACCOUNTS_REQUEST
      })

      const accounts = await fetchGoogleAccounts()

      dispatch({
        accounts,
        type: actionTypes.FETCH_GOOGLE_ACCOUNTS_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.FETCH_GOOGLE_ACCOUNTS_FAILURE
      })
      throw error
    }
  }
}
