import Fetch from '../../../services/fetch'

export async function deleteEmailThreads(
  emailThreadIds: UUID[]
): Promise<void> {
  await new Fetch().delete('/emails/threads/trash').send({
    thread_keys: emailThreadIds
  })
}
