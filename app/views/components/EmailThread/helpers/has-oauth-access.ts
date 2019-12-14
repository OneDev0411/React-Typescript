import curry from 'lodash/curry'

export const hasOAuthAccess = curry(
  (
    accounts: IOAuthAccount[],
    accountId: string | undefined,
    access: OAuthAccountScope
  ) => {
    const account = accounts.find(account => account.id === accountId)

    return !!(account && (account.scope_summary || []).includes(access))
  }
)
