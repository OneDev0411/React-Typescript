import { getGoogleAccountsSyncHistory } from '../../../models/contacts/get-google-account-sync-history'

import { getGoogleAccounts } from '../../../models/contacts/get-google-accounts'

import * as actionTypes from '../../../constants/contacts'

export type IGoogleAccountActions =
  | { type: typeof actionTypes.FETCH_GOOGLE_ACCOUNTS_REQUEST }
  | {
      type: typeof actionTypes.FETCH_GOOGLE_ACCOUNTS_SUCCESS
      accounts: IGoogleAccountWithHistory[]
    }
export function fetchGoogleAccounts() {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_GOOGLE_ACCOUNTS_REQUEST
      })

      const accounts = await getGoogleAccounts()

      const syncHistories = await Promise.all(
        accounts.map(account => getGoogleAccountsSyncHistory(account.id))
      )

      dispatch({
        accounts: accounts.map((account, index) => ({
          ...account,
          sync_history: syncHistories[index]
        })),
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
