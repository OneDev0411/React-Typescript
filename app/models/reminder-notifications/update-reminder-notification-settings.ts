import Fetch from 'services/fetch'

export async function updateReminderNotificationSettings(
  settings: readonly ICalendarReminderNotificationSetting[]
): Promise<void> {
  await new Fetch().put('/calendar/settings/notifications').send({ settings })
}
