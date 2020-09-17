import Fetch from 'services/fetch'

export type ReminderNotificationSetting = Pick<
  ICalendarReminderNotificationSetting,
  'object_type' | 'event_type' | 'reminder'
>

export async function updateReminderNotificationSettings(
  settings: readonly ReminderNotificationSetting[]
): Promise<void> {
  await new Fetch().put('/calendar/settings/notifications').send({ settings })
}
