import * as actionTypes from 'constants/contacts'
import { OAuthProvider } from 'constants/contacts'

export interface IOauthAccountsState {
  list: Record<OAuthProvider, IOAuthAccount[]>
  /**
   * A mapping from providers to loading state. null means it's not loaded yet
   */
  loading: Record<OAuthProvider, boolean | null>
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
