export function hasAccountSendPermission(account: IOAuthAccount): boolean {
  return (
    account &&
    Array.isArray(account.scope_summary) &&
    account.scope_summary.includes('mail.send')
  )
}
