import { negate } from 'lodash'

import { notDeleted } from 'utils/not-deleted'

import * as actionTypes from '../../constants/contacts'

import { OAuthProvider } from '../../constants/contacts'

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
      google: false,
      microsoft: false
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

export function isDeletedOrRevoked(account: IOAuthAccount) {
  return !notDeleted(account) || account.revoked
}

export function getAllConnectedAccounts(state: IOauthAccountsState) {
  return Object.values(state.list)
    .flat()
    .filter(negate(isDeletedOrRevoked))
}

export interface IOauthAccountsState {
  list: StringMap<IOAuthAccount[]>
  loading: StringMap<boolean>
}

export type IOAuthAccountAction =
  | {
      type: typeof actionTypes.FETCH_OAUTH_ACCOUNTS_REQUEST
      provider: OAuthProvider
    }
  | {
      type: typeof actionTypes.FETCH_OAUTH_ACCOUNTS_FAILURE
      provider: OAuthProvider
    }
  | {
      type: typeof actionTypes.FETCH_OAUTH_ACCOUNTS_SUCCESS
      provider: OAuthProvider
      accounts: IOAuthAccount[]
    }
  | {
      type: typeof actionTypes.FETCH_OAUTH_ACCOUNT_REQUEST
      provider: OAuthProvider
      accountId: string
    }
  | {
      type: typeof actionTypes.FETCH_OAUTH_ACCOUNT_FAILURE
      provider: OAuthProvider
      accountId: string
      error: any
    }
  | {
      type: typeof actionTypes.FETCH_OAUTH_ACCOUNT_SUCCESS
      provider: OAuthProvider
      account: IOAuthAccount
    }
  | {
      type: typeof actionTypes.SYNC_OAUTH_ACCOUNT_REQUEST
      accountId: string
    }
  | {
      type: typeof actionTypes.SYNC_OAUTH_ACCOUNT_SUCCESS
      accountId: string
    }
  | {
      type: typeof actionTypes.SYNC_OAUTH_ACCOUNT_FAILURE
      accountId: string
      error: any
    }
