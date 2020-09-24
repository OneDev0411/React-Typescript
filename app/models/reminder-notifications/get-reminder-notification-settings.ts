import Fetch from 'services/fetch'

export async function getReminderNotificationSettings(): Promise<
  ICalendarReminderNotificationSetting[]
> {
  const response = await new Fetch().get('/calendar/settings/notifications')

  return response.body.data
}
