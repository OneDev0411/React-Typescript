/**
 * Check for having a valid connected account for showing send notification modal
 * @param {IOAuthAccount[]} accounts The list of account
 * @returns {boolean}
 */
export function hasValidConnectedAccount(accounts: IOAuthAccount[]): boolean {
  if (!Array.isArray(accounts)) {
    return false
  }

  const filteredGoogle = accounts.filter(account => {
    if (!Array.isArray(account.scope_summary)) {
      return false
    }

    return (
      account.type === 'google_credential' &&
      !account.revoked &&
      !account.deleted_at &&
      account.scope_summary.includes('calendar')
    )
  })

  return filteredGoogle.length > 0
}
