import { OAuthProvider } from 'constants/contacts'

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
        new Date(account.created_at) > new Date(lastAccountCreationDate)
    ) || null
  )
}

/**
 * Stores current time as the time of request for connection, for the
 * given provider to later check if a new account is added after this
 * time (when navigated back from an oAuth provider.
 *
 * If called in the process of redirecting user to oAuth providers
 * for adding new connection, {@link getNewConnectedGoogleAccount}
 * will return the new account when called after it's added.
 * Currently this is used in contacts page to show **sync in progress alert**
 * on top, or **sync success dialog** after the new account is
 * successfully synced.
 *
 * If we don't want to show these UIs when connection is originated from
 * places other than contacts page, we should simply add an option for
 * calling this function in {@link useConnectOAuthAccount} to only call it
 * in contacts page
 */
export function startImportingOAuthContacts(provider: OAuthProvider) {
  localStorage.setItem(`${KEY}_${provider}`, new Date(0).toISOString())
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
