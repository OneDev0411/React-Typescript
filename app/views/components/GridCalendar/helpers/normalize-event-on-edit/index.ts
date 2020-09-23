import _get from 'lodash/get'

/**
 * return an new event for sending to the server (trigger on dropping and dragging an event)
 * @param newStart
 * @param newEnd
 * @param event
 */
interface Result extends ICalendarEvent {
  reminders: Pick<ICRMTaskReminder, 'is_relative' | 'timestamp'>[] | null
}

export function normalizeEventOnEdit(
  newStart: Date,
  newEnd: Date,
  event: ICalendarEvent
): Result {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { associations, ...omittedAssociationsEvent } = event
  const isAllDay = event.all_day || false

  if (isAllDay) {
    newStart.setUTCFullYear(
      newStart.getFullYear(),
      newStart.getMonth(),
      newStart.getDate()
    )
    newStart.setUTCHours(0, 0, 0, 0)

    newEnd.setUTCFullYear(
      newEnd.getFullYear(),
      newEnd.getMonth(),
      newEnd.getDate()
    )
    newEnd.setUTCHours(0, 0, 0, 0)
  }

  const start = newStart.getTime() / 1000
  const end = newEnd.getTime() / 1000
  const status = newStart.getTime() <= new Date().getTime() ? 'DONE' : 'PENDING'

  const loadedReminder = _get(
    event,
    'full_crm_task.reminders[0].timestamp',
    false
  )
  const createdReminder = _get(event, 'reminders[0].timestamp', false)
  const remiderValue = loadedReminder || createdReminder

  let responseEvent = {
    ...omittedAssociationsEvent,
    task_type: event.event_type,
    timestamp: start,
    due_date: start,
    end_date: end,
    reminders: remiderValue
      ? [
          {
            is_relative: true,
            timestamp: start - (event.timestamp - remiderValue)
          }
        ]
      : [],
    status
  }

  return responseEvent
}
