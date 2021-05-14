import Fetch from 'services/fetch'

async function getShowingTotalNotificationCount(): Promise<number> {
  const response = await new Fetch()
    .get('/showings/notifications')
    .query({ limit: 1 })

  return response.body?.info?.total || 0
}

export default getShowingTotalNotificationCount
