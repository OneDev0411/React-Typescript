import { useState } from 'react'
import useEffect from 'use-deep-compare-effect'

import { getCalendar, FilterQuery } from '../../models/get-calendar'
import { normalize } from './normalize-events'

interface ApiOptions {
  range: [number, number]
  filter?: FilterQuery
  associations?: string[]
  users?: UUID[]
}

export function useLoadCalendar(apiOptions: ApiOptions) {
  const [events, setEvents] = useState<CalendarEventsList>({})
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    async function getCalendarEvents() {
      try {
        // enable loading flag
        setLoading(true)

        // fetch calendar data from server based on given parameters
        const events = await getCalendar(apiOptions)

        // return fetched events
        setEvents(normalize(apiOptions.range, events))
      } catch (e) {
        console.log(e)
        setError(e)
        setEvents({})
      } finally {
        setLoading(false)
      }
    }

    getCalendarEvents()
  }, [apiOptions])

  return {
    events,
    error,
    isLoading
  }
}
