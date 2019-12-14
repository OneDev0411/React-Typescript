import Fetch from '../../../services/fetch'

type MailServerNames = 'google' | 'microsoft'

export async function updateMessageIsRead(
  mailServerName: MailServerNames,
  credentialId: string,
  messageId: string,
  status: boolean
): Promise<void> {
  try {
    await new Fetch()
      .put(`/emails/${mailServerName}/${credentialId}/messages/${messageId}`)
      .send({
        status
      })
  } catch (e) {
    console.log(e)
    throw e
  }
}
