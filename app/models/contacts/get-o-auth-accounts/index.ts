import Fetch from '../../../services/fetch'

export async function getOAuthAccounts(
  provider: string,
  withHistory = false
): Promise<IOAuthAccount[]> {
  const response = await new Fetch()
    .get(`/users/self/${provider}`)
    .query(
      withHistory ? { associations: `${provider}_credential.histories` } : {}
    )
    .send()

  const accounts: IOAuthAccount[] = (response.body && response.body.data) || []

  return accounts.filter(account => !account.revoked)
}
