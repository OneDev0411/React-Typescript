import Fetch from '../../../services/fetch'

export async function setEmailMessagesReadStatus(
  messageIds: UUID[],
  status: boolean
): Promise<void> {
  await new Fetch().put('/emails/messages/status').send({
    message_ids: messageIds,
    is_read: status
  })
}
