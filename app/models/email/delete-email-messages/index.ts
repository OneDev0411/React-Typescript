import Fetch from '../../../services/fetch'

export async function deleteEmailMessages(messageIds: UUID[]): Promise<void> {
  await new Fetch().delete('/emails/messages/trash').send({
    message_ids: messageIds
  })
}
