import { OAuthProvider } from 'constants/contacts'

import { maxBy } from 'lodash'

const KEY = 'oAuthImportRequestTime'
/**
 * A helper for remembering oAuth contacts import in progress when user
 * is navigated to oAuth provider and back to Rechat.
 * It's called to check if any account is added since the last time
 * {@link startImportingOAuthContacts} is called
 */
export function getNewConnectedGoogleAccount(
  provider: OAuthProvider,
  currentAccounts: EnumMap<OAuthProvider, IOAuthAccount[]>
): IOAuthAccount | null {
  const lastAccountCreationDate = localStorage.getItem(`${KEY}_${provider}`)

  if (lastAccountCreationDate === null) {
    return null
  }

  return (
    currentAccounts[provider].find(
      account =>
        new Date(account.updated_at) > new Date(lastAccountCreationDate)
    ) || null
  )
}

/**
 * It remembers the last connected account to detect if a new account is
 * connected after the user is navigated back from google to our website.
 */
export function startImportingOAuthContacts(
  provider: OAuthProvider,
  currentAccounts: IOAuthAccount[]
) {
  const latestAccount = maxBy(currentAccounts, 'updated_at')

  localStorage.setItem(
    `${KEY}_${provider}`,
    latestAccount ? latestAccount.updated_at : new Date(0).toISOString()
  )
}

export function clearImportingGoogleContacts(provider: OAuthProvider) {
  localStorage.removeItem(`${KEY}_${provider}`)
}

export function getNumOfSyncedContacts(since: Date, accounts: IOAuthAccount[]) {
  return accounts
    .flatMap(account => account.histories || [])
    .reduce((sum, history) => {
      if (new Date(history.updated_at) > since) {
        return sum + history.synced_contacts_num
      }

      return sum
    }, 0)
}
