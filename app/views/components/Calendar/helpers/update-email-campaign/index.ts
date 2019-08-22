import { createDayId } from '../create-day-id'
import { sortEvents } from '../sort-events'

import eventEmptyState from '../get-event-empty-state'

/**
 * this function tries to patch the updated email campaign into
 * events list of calendar without fetching data from server
 * what makes this function complicated is changing due date in the
 * drawer, so in this case we have to find the event from previous day and
 * remove that and then put that into the new day
 * @param events - list of calendar events
 * @param event - the specific event
 * @param emailCampaign - the email campaign object
 */
export function updateEmailCampaign(
  events: CalendarEventsList,
  event: ICalendarEvent,
  emailCampaign: IEmailCampaign
) {
  const currentDayId = createDayId(event.timestamp * 1000, false)
  const newDayId = createDayId(emailCampaign.due_at * 1000, false)

  /**
   * omit the event from events list of current day if the schedule
   * time is changed by user
   */
  if (currentDayId !== newDayId) {
    const nextEvents = {
      ...events,
      // remove event from current day
      [currentDayId]: events[currentDayId].filter(
        event => event.campaign !== emailCampaign.id
      ),
      // remove empty state from target day since we want put an event there
      [newDayId]: events[currentDayId].filter(
        event => event.event_type !== eventEmptyState.event_type
      )
    }

    return sortEvents({
      ...nextEvents,
      // put empty state into old day if it has no more events
      [currentDayId]:
        nextEvents[currentDayId].length > 0
          ? nextEvents[currentDayId]
          : [eventEmptyState],
      // put event into the new day!
      [newDayId]: [
        ...(nextEvents[newDayId] || []),
        {
          ...event,
          timestamp: emailCampaign.due_at,
          title: emailCampaign.subject
        }
      ]
    })
  }

  // when the due date isn't changed, we can simply patch the event
  return sortEvents({
    ...events,
    [newDayId]: (events[newDayId] as ICalendarEvent[]).map(
      (event: ICalendarEvent) =>
        event.event_type === 'scheduled_email' &&
        event.campaign === emailCampaign.id
          ? {
              ...event,
              title: emailCampaign.subject
            }
          : event
    )
  })
}
