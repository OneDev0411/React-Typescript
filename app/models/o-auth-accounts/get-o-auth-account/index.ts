import Fetch from 'services/fetch'

export async function getOAuthAccount(
  provider: string,
  accountId: string,
  withHistory = false
): Promise<IOAuthAccount> {
  const response = await new Fetch()
    .get(`/users/self/${provider}/${accountId}`)
    .query(
      withHistory ? { associations: `${provider}_credential.histories` } : {}
    )
    .send()

  return response.body && response.body.data
}
