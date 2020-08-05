/**
 * return an new event for sending to the server (trigger on dropping and dragging an event)
 * @param newStart
 * @param newEnd
 * @param event
 */
export function normalizeEventOnEdit(
  newStart: Date,
  newEnd: Date,
  event: ICalendarEvent
) {
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

  return {
    ...omittedAssociationsEvent,
    task_type: event.event_type,
    timestamp: start,
    due_date: start,
    end_date: end,
    status: newStart.getTime() <= new Date().getTime() ? 'DONE' : 'PENDING'
  }
}
