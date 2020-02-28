import { OAuthProvider } from 'constants/contacts'

import Fetch from '../../../services/fetch'

export async function setEmailThreadStatus(
  oauthProvider: OAuthProvider,
  oauthProviderCredential: UUID,
  messageIds: UUID[],
  status: boolean = true
): Promise<void> {
  await new Fetch()
    .put(`/emails/${oauthProvider}/${oauthProviderCredential}/messages`)
    .send({ status, messageIds })
}
