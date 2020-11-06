declare interface ICalendarReminderNotificationSetting {
  type: 'calendar_notification_setting'
  id: UUID
  object_type: string
  event_type: string
  date_part: number
  reminder: number
}
