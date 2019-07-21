import { IOAuthAccountAction } from 'actions/contacts/fetch-o-auth-accounts'

import * as actionTypes from '../../constants/contacts'
import { OAuthProvider } from '../../constants/contacts'

export function oAuthAccounts(
  state: EnumMap<OAuthProvider, IOAuthAccount[]> = {
    google: [],
    microsoft: []
  },
  action: IOAuthAccountAction
) {
  switch (action.type) {
    case actionTypes.FETCH_OAUTH_ACCOUNTS_SUCCESS:
      return { ...state, [action.provider]: action.accounts }
    default:
      return state
  }
}
