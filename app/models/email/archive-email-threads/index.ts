import Fetch from '../../../services/fetch'

export async function archiveEmailThreads(
  emailThreadIds: UUID[]
): Promise<void> {
  await new Fetch().put('/emails/threads/archive').send({
    thread_keys: emailThreadIds
  })
}
