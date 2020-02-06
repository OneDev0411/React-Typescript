import { OAuthProvider } from 'constants/contacts'

import Fetch from '../../../services/fetch'

export async function setEmailReadStatus(
  oauthProvider: OAuthProvider,
  oauthProviderCredential: UUID,
  messageId: UUID,
  readStatus: boolean = true
): Promise<void> {
  await new Fetch()
    .put(
      `/emails/${oauthProvider}/${oauthProviderCredential}/messages/${messageId}`
    )
    .send({ status: readStatus })
}
