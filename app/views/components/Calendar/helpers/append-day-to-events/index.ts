import { createDayId } from '../create-day-id'
import eventEmptyState from '../get-event-empty-state'
import { sortEvents } from '../sort-events'

export function appendDayToEvents(date: Date, events: CalendarEventsList) {
  const dayId = createDayId(date, false)

  const newEvents = {
    ...events,
    [dayId]: [eventEmptyState]
  }

  return sortEvents(newEvents)
}
