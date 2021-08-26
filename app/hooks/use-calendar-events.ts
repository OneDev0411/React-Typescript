import { useState } from 'react'

import { isToday, setYear, compareAsc } from 'date-fns'
import { useSelector } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'

import {
  getDateRange,
  Format
} from 'components/ContactProfileTimeline/helpers/get-date-range'
import { useLoadingEntities } from 'hooks/use-loading'
import { getCalendar, CalendarObjectType } from 'models/calendar/get-calendar'
import { selectUser } from 'selectors/user'

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
