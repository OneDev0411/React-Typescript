import Fetch from '../../../services/fetch'

export async function getEmailThread(threadKey: string): Promise<IEmailThread> {
  const response = await new Fetch().get(`/emails/threads/${threadKey}`)

  return response.body.data
}
