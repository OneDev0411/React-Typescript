import Fetch from '../../../services/fetch'

export async function getEmailThread(threadKey: string): Promise<IEmailThread> {
  const response = await new Fetch().get(`/emails/threads/${threadKey}`)

  // FIXME: add .data when https://gitlab.com/rechat/web/issues/3281#note_220181865 is addressed
  return response.body
}
