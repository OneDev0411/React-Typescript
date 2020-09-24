import { getReminderNotificationSettings } from 'models/reminder-notifications/get-reminder-notification-settings'

import {
  CONTACT_DATE_OBJECT_TYPE,
  HOME_ANNIVERSARY_EVENT_TYPE
} from '../constants'

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
      if (setting.event_type !== HOME_ANNIVERSARY_EVENT_TYPE) {
        return setting
      }

      return {
        ...setting,
        object_type: CONTACT_DATE_OBJECT_TYPE
      }
    })
  }
}
