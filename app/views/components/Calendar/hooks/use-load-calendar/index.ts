import { useState } from 'react'
import useEffect from 'use-deep-compare-effect'

import { getCalendar, FilterQuery } from '../../models/get-calendar'

import { normalize } from './normalize-events'
import { sortEvents } from './sort-events'

interface ApiOptions {
  range: NumberRange
  filter?: FilterQuery
  associations?: string[]
  users?: UUID[]
}

interface Options {
  reset: boolean
}

export function useLoadCalendar(apiOptions: ApiOptions, options: Options) {
  const [events, setEvents] = useState<CalendarEventsList>({})
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getCalendarEvents() {
      try {
        if (isLoading) {
          return
        }

        // enable loading flag
        setIsLoading(true)

        console.log(
          `[ + ] Fetching Calendar in range of %c${new Date(
            apiOptions.range[0] * 1000
          ).toUTCString()} %c${new Date(
            apiOptions.range[1] * 1000
          ).toUTCString()}`,
          'color: green',
          'color: blue'
        )

        // fetch calendar data from server based on given parameters
        const newEvents = await getCalendar(apiOptions)

        // concat newEvents and current events
        const list = options.reset
          ? normalize(apiOptions.range, newEvents)
          : {
              ...events,
              ...normalize(apiOptions.range, newEvents)
            }

        setEvents(sortEvents(list))
      } catch (e) {
        console.log(e)
        setError(e)
        setEvents({})
      } finally {
        setIsLoading(false)
      }
    }

    getCalendarEvents()

    // eslint-disable-next-line
  }, [apiOptions])

  return {
    events,
    error,
    isLoading
  }
}
