import Fetch from '../../../services/fetch'

export async function setEmailThreadsReadStatus(
  emailThreadIds: UUID[],
  status: boolean
): Promise<void> {
  await new Fetch().put('/emails/threads/status').send({
    thread_keys: emailThreadIds,
    is_read: status
  })
}
