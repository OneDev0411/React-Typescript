import Fetch from '../../../services/fetch'

export async function getUnreadEmailThreadsCount(): Promise<number> {
  const response = await new Fetch().post('/emails/threads/filter').query({
    limit: 1,
    is_read: false
  })

  return response.body.info.total
}
