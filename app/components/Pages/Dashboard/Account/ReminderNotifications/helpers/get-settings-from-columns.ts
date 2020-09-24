import { ReminderNotificationSetting } from 'models/reminder-notifications/update-reminder-notification-settings'

import { ColumnState } from '../types'

export function getSettingsFromColumns(
  columns: readonly ColumnState[]
): ReminderNotificationSetting[] {
  return columns.flatMap(({ objectType, items }) =>
    items
      .filter(({ selected }) => selected)
      .map<ReminderNotificationSetting>(({ eventType, reminderSeconds }) => ({
        object_type: objectType,
        event_type: eventType,
        reminder: reminderSeconds
      }))
  )
}
