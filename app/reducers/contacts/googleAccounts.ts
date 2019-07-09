import { IGoogleAccountActions } from 'actions/contacts/fetch-google-accounts'

import * as actionTypes from '../../constants/contacts'

export function googleAccounts(
  state: IGoogleAccountWithHistory[] = [],
  action: IGoogleAccountActions
) {
  switch (action.type) {
    case actionTypes.FETCH_GOOGLE_ACCOUNTS_SUCCESS:
      return action.accounts
    default:
      return state
  }
}
