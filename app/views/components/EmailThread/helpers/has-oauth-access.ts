export function hasOAuthAccess(
  accounts: IOAuthAccount[],
  accountId: UUID | undefined,
  access: OAuthAccountScope
) {
  const account = accounts.find(account => account.id === accountId)

  return !!(account && (account.scope_summary || []).includes(access))
}
