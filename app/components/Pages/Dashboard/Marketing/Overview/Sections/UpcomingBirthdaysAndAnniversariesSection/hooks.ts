import { useState, useEffect } from 'react'
import { isToday, setYear, compareAsc } from 'date-fns'

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
      const calendarEvents = (await getCalendar({
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
      })) as ICalendarEvent[]

      // API team made me do this and sort the events on the client side
      // More info: https://gitlab.com/rechat/web/-/issues/5058#note_561554003
      const sortedEvents = calendarEvents
        .map(event => {
          const eventNextOccurence = new Date(event.next_occurence)

          const currentYear = new Date().getFullYear()
          const nextOccurence = isToday(
            setYear(eventNextOccurence, currentYear)
          )
            ? setYear(eventNextOccurence, currentYear)
            : eventNextOccurence

          return {
            ...event,
            next_occurence: nextOccurence.toISOString()
          }
        })
        .sort((a, b) =>
          compareAsc(new Date(a.next_occurence), new Date(b.next_occurence))
        )

      setEvents(sortedEvents)
    }

    fetchEvents()
  }, [])

  return {
    events: events || [],
    isLoading
  }
}
