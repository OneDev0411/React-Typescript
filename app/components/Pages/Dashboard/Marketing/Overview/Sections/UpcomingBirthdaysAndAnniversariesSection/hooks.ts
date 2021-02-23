import { useState, useEffect } from 'react'

import { getCalendar } from 'models/calendar/get-calendar'
import { useLoadingEntities } from 'hooks/use-loading'
import {
  getDateRange,
  Format
} from 'components/Calendar/helpers/get-date-range'

interface UseBirthdaysAndAnniversaries {
  isLoading: boolean
  events: ICalendarEvent[]
}

export function useBirthdaysAndAnniversaries(): UseBirthdaysAndAnniversaries {
  const [events, setEvents] = useState<Nullable<ICalendarEvent[]>>(null)

  const [isLoading] = useLoadingEntities(events)

  useEffect(() => {
    async function fetchEvents() {
      const range = getDateRange(new Date().getTime(), Format.Next)
      const calendarEvents = await getCalendar({
        range,
        filter: {
          'event_types[]': [
            'wedding_anniversary',
            'birthday',
            'child_birthday',
            'home_anniversary'
          ],
          'object_types[]': ['contact_attribute', 'contact', 'deal_context']
        },
        associations: ['calendar_event.people'] // , 'calendar_event.full_thread'
      })

      setEvents(calendarEvents)
    }

    fetchEvents()
  }, [])

  return {
    events: events || [],
    isLoading
  }
}
