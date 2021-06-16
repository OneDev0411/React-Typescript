import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'

import { isToday, setYear, compareAsc } from 'date-fns'

import { getCalendar, CalendarObjectType } from 'models/calendar/get-calendar'
import { useLoadingEntities } from 'hooks/use-loading'
import {
  getDateRange,
  Format
} from 'components/Calendar/helpers/get-date-range'

interface UseCalendarEvents {
  isLoading: boolean
  events: ICalendarEvent[]
}

export function useCalendarEvents(
  objectTypes: CalendarObjectType[]
): UseCalendarEvents {
  const [events, setEvents] = useState<Nullable<ICalendarEvent[]>>(null)

  const [isLoading] = useLoadingEntities(events)

  useDeepCompareEffect(() => {
    async function fetchEvents() {
      const range = getDateRange(new Date().getTime(), Format.Next)
      const calendarEvents = (await getCalendar({
        range,
        filter: {
          'object_types[]': objectTypes
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
  }, [objectTypes])

  return {
    events: events || [],
    isLoading
  }
}
