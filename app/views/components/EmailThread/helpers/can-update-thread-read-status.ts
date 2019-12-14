export function canUpdateThreadReadStatus(
  accounts: IOAuthAccount[],
  thread: IEmailThread
): boolean {
  const credentialName = ['google_credential', 'microsoft_credential'].find(
    cred => !!thread[cred]
  )
  const account = accounts.find(account => account.type === credentialName)

  return !!(
    account &&
    Array.isArray(account.scope_summary) &&
    account.scope_summary.includes('mail.modify')
  )
}
