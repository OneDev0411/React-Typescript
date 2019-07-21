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

  return response.body && response.body.data
}
