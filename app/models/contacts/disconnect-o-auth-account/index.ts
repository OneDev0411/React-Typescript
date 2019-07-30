import Fetch from '../../../services/fetch'

export async function disconnectOAuthAccount(
  provider: string,
  accountId: string
): Promise<IOAuthAccount> {
  const response = await new Fetch()
    .delete(`/users/self/${provider}/${accountId}`)
    .send()

  return response.body && response.body.data
}
