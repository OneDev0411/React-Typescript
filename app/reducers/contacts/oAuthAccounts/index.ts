import * as actionTypes from '../../../constants/contacts'
import { IOAuthAccountAction, IOauthAccountsState } from './types'

/**
 * This reducer is independent of contacts and it's here for historical reasons
 * We can extract it out of the contact reducer in later
 */
export function oAuthAccounts(
  state: IOauthAccountsState = {
    // we could have structure state like:
    // {provide: {loading: boolean, list: IAccount[]}} but it requires more
    // work for accessing list of all accounts which is the most requirement
    // in this feature area. Ideally API should provide an endpoint
    // for getting the list of accounts instead of grouping them by provider
    list: {
      google: [],
      microsoft: []
    },
    loading: {
      google: null,
      microsoft: null
    }
  },
  action: IOAuthAccountAction
) {
  switch (action.type) {
    case actionTypes.FETCH_OAUTH_ACCOUNTS_SUCCESS:
      return {
        ...state,
        list: { ...state.list, [action.provider]: action.accounts },
        loading: { ...state.loading, [action.provider]: false }
      }
    case actionTypes.FETCH_OAUTH_ACCOUNT_SUCCESS:
      return {
        ...state,
        list: {
          ...state.list,
          [action.provider]: state.list[action.provider].map(account =>
            account.id === action.account.id ? action.account : account
          )
        }
      }
    case actionTypes.FETCH_OAUTH_ACCOUNTS_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, [action.provider]: true }
      }
    case actionTypes.FETCH_OAUTH_ACCOUNTS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, [action.provider]: false }
      }
    default:
      return state
  }
}

export * from './types'
export * from './helpers'
