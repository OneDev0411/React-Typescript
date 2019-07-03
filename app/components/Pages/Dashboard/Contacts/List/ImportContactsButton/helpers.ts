import { maxBy } from 'lodash'

const KEY = 'importingGoogleContacts'
// A helper for remembering google contacts import in progress when user
// is navigated to google and back to Rechat
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
 *
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
