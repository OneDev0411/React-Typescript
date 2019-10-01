import { OAuthProvider } from 'constants/contacts'

import Fetch from 'services/fetch'

export async function sendEmailViaOauthAccount(
  provider: OAuthProvider,
  accountId: UUID,
  email: IEmailThreadEmailInput
): Promise<IEmailThreadEmail> {
  const response = await new Fetch()
    .post(`/users/self/${provider}/${accountId}/send`)
    .send(email)

  return response.body && response.body.data
}
