import { maxBy } from 'lodash'

const KEY = 'importingGoogleContacts'
/**
 * A helper for remembering google contacts import in progress when user
 * is navigated to google and back to Rechat.
 * It's called to check if any account is added since the last time
 * {@link startImportingGoogleContacts} is called
 */
export function getNewConnectedGoogleAccount(
  currentAccounts: IGoogleAccount[]
): IGoogleAccount | null {
  const lastGoogleAccountCreationDate = localStorage.getItem(KEY)

  if (lastGoogleAccountCreationDate === null) {
    return null
  }

  return (
    currentAccounts.find(
      account =>
        new Date(account.updated_at) > new Date(lastGoogleAccountCreationDate)
    ) || null
  )
}

/**
 * It remembers the last connected account to detect if a new account is
 * connected after the user is navigated back from google to our website.
 */
export function startImportingGoogleContacts(
  currentAccounts: IGoogleAccount[]
) {
  const latestAccount = maxBy(currentAccounts, 'updated_at')

  localStorage.setItem(
    KEY,
    latestAccount ? latestAccount.updated_at : new Date(0).toISOString()
  )
}

export function clearImportingGoogleContacts() {
  localStorage.removeItem(KEY)
}

export function getNumOfSyncedContacts(
  since: string | number | Date,
  accounts: IGoogleAccount[]
) {
  return accounts.reduce(
    (numSyncedContacts, account) =>
      new Date(account.updated_at) > new Date(since)
        ? numSyncedContacts + 0
        : 0,
    0
  )
}
