import Fetch from 'services/fetch'

// TODO: something seems wrong with this function signature:
export async function forcePushReminderNotificationSettings(): Promise<void> {
  await new Fetch().post('/calendar/settings/notifications/force')
}
