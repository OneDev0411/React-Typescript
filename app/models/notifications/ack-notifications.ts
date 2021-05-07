import { ackNotification } from './ack-notification'

export async function ackNotifications(notificationIds: Optional<UUID[]>) {
  const promises =
    notificationIds?.map(notificationId => ackNotification(notificationId)) ||
    []

  await Promise.all(promises)
}
