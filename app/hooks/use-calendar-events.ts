import { useState } from 'react'

import { startOfDay, compareAsc } from 'date-fns'
import { useSelector } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'

import { useLoadingEntities } from '@app/hooks/use-loading'
import {
  getCalendar,
  CalendarObjectType
} from '@app/models/calendar/get-calendar'
import { selectUser } from '@app/selectors/user'
import {
  getDateRange,
  Format
} from '@app/views/components/ContactProfileTimeline/helpers/get-date-range'

interface UseCalendarEvents {
  isLoading: boolean
  events: ICalendarEvent[]
}

export function useCalendarEvents(
  objectTypes: CalendarObjectType[],
  days?: number
): UseCalendarEvents {
  const [events, setEvents] = useState<Nullable<ICalendarEvent[]>>(null)

  const [isLoading] = useLoadingEntities(events)
  const user = useSelector(selectUser)

  useDeepCompareEffect(() => {
    async function fetchEvents() {
      const range = getDateRange(new Date().getTime(), Format.Next, days)
      const calendarEvents = (await getCalendar({
        range,
        filter: {
          'object_types[]': objectTypes
        },
        associations: ['calendar_event.people'], // , 'calendar_event.full_thread'
        users: [user.id]
      })) as ICalendarEvent[]

      const sortedEvents = sortCalendarEventsOnNextOccurrence(calendarEvents)

      setEvents(sortedEvents)
    }

    fetchEvents()
  }, [objectTypes])

  return {
    events: events || [],
    isLoading
  }
}

export function sortCalendarEventsOnNextOccurrence(
  events: ICalendarEvent[]
): ICalendarEvent[] {
  return events
    .map(event => {
      if (event.all_day) {
        return {
          ...event,
          next_occurence: startOfDay(
            new Date(event.next_occurence)
          ).toISOString()
        }
      }

      return event
    })
    .sort((a, b) => {
      return compareAsc(new Date(a.next_occurence), new Date(b.next_occurence))
    })
}
