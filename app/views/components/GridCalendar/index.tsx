import React, { useState, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import useEffectOnce from 'react-use/lib/useEffectOnce'
// List of full calendar assets
import FullCalendar from '@fullcalendar/react'
import { EventInput } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick

import { getCalendar, FilterQuery } from 'models/calendar/get-calendar'

import { IAppState } from 'reducers/index'

import { viewAs } from 'utils/user-teams'

// List of basic calendar dependency
import { getDateRange } from '../Calendar/helpers/get-date-range'
import { ApiOptions, FetchOptions } from '../Calendar/types'

// helpers
import { normalizeEvents } from './helpers/normalize-events'

interface StateProps {
  viewAsUsers: UUID[]
  user: IUser
}

interface Props {
  user?: IUser
  viewAsUsers?: UUID[]
  initialRange?: NumberRange
  associations?: string[]
}

export const GridCalendarPresentation = ({
  user,
  viewAsUsers,
  initialRange,
  associations = []
}: Props) => {
  // calendat reference
  const calendarRef = useRef<FullCalendar>(null)

  // list of current events
  const [events, setEvents] = useState<EventInput[]>([])

  // request status
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false)

  // current range of fetched events
  const [calendarRange, setCalendarRange] = useState<NumberRange>(
    getDateRange()
  )

  /**
   * fetches events based on the given [[ApiOptions]]
   * @param apiOptions - the api options
   * @param options - fetching options
   */
  const fetchEvents = useCallback(
    async (apiOptions: ApiOptions, options: FetchOptions = {}) => {
      try {
        // enable loading flag
        setIsLoading(true)

        console.log(
          `[ + ] Fetching Calendar with range of %c${new Date(
            apiOptions.range[0] * 1000
          ).toUTCString()} %c${new Date(
            apiOptions.range[1] * 1000
          ).toUTCString()}`,
          'color: green',
          'color: blue'
        )

        // show all events in rechat
        /* 
          TODO: should add dynamic filter
          should add filter base on the route which available now on timeline
          calendar and we decide to discard it here for now
        */
        const defaultFilter: FilterQuery = {
          'object_types[]': [
            'contact',
            'contact_attribute',
            'crm_task',
            'deal_context'
          ]
        }

        // fetch calendar data from server based on given parameters
        const fetchedEvents = await getCalendar({
          users: viewAsUsers,
          filter: defaultFilter,
          associations: ['calendar_event.people', ...associations],
          ...apiOptions
        })

        const nextEvents: ICalendarEvent[] = options.reset
          ? fetchedEvents
          : fetchedEvents.concat(events)

        // normalized events for using in full calendar
        const normalizedEvents: EventInput[] = normalizeEvents(nextEvents)

        // update events list
        setEvents(normalizedEvents)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    },
    [viewAsUsers, events, associations]
  )

  /**
   * handles updating ranges when given date is outside of current
   * calendar range
   * @param date
   */
  const handleLoadEvents = async (range: NumberRange | null = null) => {
    const query: NumberRange = range || calendarRange

    // set loading position to center again
    // setLoadingPosition(LoadingPosition.Middle)

    // reset calendar range
    setCalendarRange(query)

    await fetchEvents(
      {
        range: query
      },
      {
        reset: true
      }
    )
  }

  /**
   * Load initia events (behaves as componentDidMount)
   */
  useEffectOnce(() => {
    handleLoadEvents(initialRange)
  })

  return (
    <FullCalendar
      height="parent"
      defaultView="dayGridMonth"
      eventLimit
      editable
      header={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      }}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      ref={calendarRef}
      events={events}
    />
  )
}

const mapStateToProps = ({ user }: IAppState) => ({
  user,
  viewAsUsers: viewAs(user)
})

export const GridCalendar = connect<StateProps, {}, Props>(mapStateToProps)(
  GridCalendarPresentation
)
