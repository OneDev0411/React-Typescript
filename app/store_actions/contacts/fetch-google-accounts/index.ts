import { getGoogleAccounts } from '../../../models/contacts/get-google-accounts'

import * as actionTypes from '../../../constants/contacts'

export type IGoogleAccountActions =
  | { type: typeof actionTypes.FETCH_GOOGLE_ACCOUNTS_REQUEST }
  | {
      type: typeof actionTypes.FETCH_GOOGLE_ACCOUNTS_SUCCESS
      accounts: IGoogleAccount[]
    }
export function fetchGoogleAccounts() {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_GOOGLE_ACCOUNTS_REQUEST
      })

      const accounts = await getGoogleAccounts(true)

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
