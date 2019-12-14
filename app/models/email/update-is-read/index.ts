import { OAuthProvider } from 'constants/contacts'

import Fetch from '../../../services/fetch'

export async function updateMessageIsRead(
  name: OAuthProvider,
  id: string,
  messageId: string,
  status: boolean
): Promise<void> {
  try {
    await new Fetch().put(`/emails/${name}/${id}/messages/${messageId}`).send({
      status
    })
  } catch (e) {
    console.log(e)
    throw e
  }
}
