export function canUpdateThreadReadStatus(
  accounts: IOAuthAccount[],
  thread: IEmailThread
): boolean {
  const credentialType = ['google_credential', 'microsoft_credential'].find(
    cred => !!thread[cred]
  )
  const account = accounts.find(account => account.type === credentialType)

  return Array.isArray(account) && account.includes('mail.modify')
}
