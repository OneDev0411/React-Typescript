import Fetch from 'services/fetch'

export async function ackNotification(notificationId: UUID) {
  await new Fetch().delete(`/notifications/${notificationId}`)
}
