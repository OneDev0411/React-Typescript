import Fetch from 'services/fetch'

export async function ackNotification(notificationId: UUID): Promise<void> {
  await new Fetch().delete(`/notifications/${notificationId}`)
}
