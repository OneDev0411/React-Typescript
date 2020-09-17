import { getReminderNotificationSettings } from 'models/reminder-notifications/get-reminder-notification-settings'

import { contactDateObjectType, homeAnniversaryEventType } from '../constants'

export async function getSettings(): Promise<
  readonly ICalendarReminderNotificationSetting[]
> {
  const rawSettings = await getReminderNotificationSettings()
  const settings = handleHomeAnniversaries(rawSettings)

  return settings

  // This fix is forced from the API side:
  function handleHomeAnniversaries(
    settings: typeof rawSettings
  ): typeof rawSettings {
    return settings.map(setting => {
      if (setting.event_type !== homeAnniversaryEventType) {
        return setting
      }

      return {
        ...setting,
        object_type: contactDateObjectType
      }
    })
  }
}
