import { useCalendarEvents } from 'hooks/use-calendar-events'

import { ThisWeeksSchedule } from './ThisWeeksSchedule'
import { UpcomingCelebrations } from './UpcomingCelebrations'

export function Dailies() {
  // For sending fewer API requests both UpcomingCelebrations and TodaysSchedule
  // components share the same payload and then will consume the event types
  // based on their needs. For example UpcomingCelebrations only needs
  // 'contact_attribute', 'deal_context' object types.
  // For more details on what kinds of event each objectTypes would provide refer
  // to type CalendarObjectType
  const { isLoading, events } = useCalendarEvents(
    ['crm_task', 'contact', 'contact_attribute', 'deal_context'],
    7 // get events of last 7 days
  )

  return (
    <>
      <ThisWeeksSchedule isLoading={isLoading} events={events} />
      <UpcomingCelebrations isLoading={isLoading} events={events} />
    </>
  )
}
