import { OAuthProvider } from 'constants/contacts'

import Fetch from '../../../services/fetch'

export async function syncOAuthAccount(
  provider: OAuthProvider,
  accountId: string
): Promise<IOAuthAccount> {
  const response = await new Fetch()
    .post(`/users/self/${provider}/${accountId}/sync`)
    .send()

  return response.body && response.body.data
}
