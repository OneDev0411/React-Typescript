import React, { memo, useState, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'
// List of full calendar assets
import FullCalendar from '@fullcalendar/react'
import { EventInput, View, EventApi } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick

import { getCalendar, FilterQuery } from 'models/calendar/get-calendar'

import { IAppState } from 'reducers/index'

import { viewAs } from 'utils/user-teams'

import { CrmEventType } from 'components/Calendar/types'

import { EventController } from './components/EventController'

// List of basic calendar dependency
import {
  getDateRange,
  shouldReCreateRange,
  Format
} from './helpers/get-date-range'
import { ApiOptions, FetchOptions } from '../Calendar/types'

// helpers
import { normalizeEvents } from './helpers/normalize-events'
import { upsertCrmEvents } from '../Calendar/helpers/upsert-crm-events'

interface StateProps {
  viewAsUsers: UUID[]
  user: IUser
}

interface Props {
  user?: IUser
  contrariwise?: boolean
  viewAsUsers?: UUID[]
  initialRange?: NumberRange
  associations?: string[]
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    loadingContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
    },
    isLoading: {
      filter: 'blur(2px)'
    }
  }),
  {
    name: 'GridCalendar'
  }
)

export const GridCalendarPresentation = ({
  user,
  viewAsUsers,
  initialRange,
  contrariwise = false,
  associations = []
}: Props) => {
  const classes = useStyles()
  // calendat reference
  const calendarRef = useRef<FullCalendar>(null)

  // list of server events
  const [rowEvents, setRowEvents] = useState<ICalendarEvent[]>([])
  // list of current events
  const [events, setEvents] = useState<EventInput[]>([])
  // selected event
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(
    null
  )
  // request status
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
          : fetchedEvents.concat(rowEvents)

        // normalized events for using in full calendar
        const normalizedEvents: EventInput[] = normalizeEvents(nextEvents)

        // update events list
        setRowEvents(nextEvents)
        setEvents(normalizedEvents)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    },
    [viewAsUsers, rowEvents, associations]
  )

  const handleLoadEvents = async (range: NumberRange | null = null) => {
    const query: NumberRange = range || calendarRange

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
   * creates the ranges
   */
  const createRanges = useCallback(
    (
      direction: Format
    ): {
      query: NumberRange
      calendar: NumberRange
    } => {
      let actualDirection = direction

      if (contrariwise && direction === Format.Next) {
        actualDirection = Format.Previous
      }

      if (contrariwise && direction === Format.Previous) {
        actualDirection = Format.Next
      }

      const query: NumberRange =
        actualDirection === Format.Next
          ? getDateRange(calendarRange[1] * 1000, Format.Next)
          : getDateRange(calendarRange[0] * 1000, Format.Previous)

      const calendar: NumberRange =
        actualDirection === Format.Next
          ? [calendarRange[0], query[1]]
          : [query[0], calendarRange[1]]

      return {
        query,
        calendar
      }
    },
    [calendarRange, contrariwise]
  )

  /**
   * handles updating ranges when user is trying to fetch future events
   */
  const handleLoadMoreEvents = useCallback(
    (format: Format = Format.Middle): void => {
      if (isLoading) {
        return
      }

      const { query, calendar: nextCalendarRange } = createRanges(format)

      setCalendarRange(nextCalendarRange)
      fetchEvents({
        range: query
      })
    },
    [createRanges, fetchEvents, isLoading]
  )

  /**
   * trigger on layout chnage
   */
  const handleDatesRender = (e: { view: View; el: HTMLElement }) => {
    const { view } = e
    const [start, end] = calendarRange

    if (shouldReCreateRange(start * 1000, view.currentStart.getTime())) {
      handleLoadMoreEvents(Format.Previous)
    }

    if (shouldReCreateRange(end * 1000, view.currentEnd.getTime())) {
      handleLoadMoreEvents(Format.Next)
    }
  }

  /**
   * trigger on clicking on an event
   */
  const handleClickEvent = ({ event }: { event: EventApi }) => {
    const currentEvent: ICalendarEvent = event.extendedProps?.rowEvent

    setSelectedEvent(currentEvent)
  }

  /**
   * triggers when a crm events update or delete
   */
  const handleCrmEventChange = useCallback(
    (event: IEvent, type: CrmEventType) => {
      const nextEvents: ICalendarEvent[] = upsertCrmEvents(
        rowEvents,
        event,
        type
      )
      const normalizedEvents: EventInput[] = normalizeEvents(nextEvents)

      setRowEvents(nextEvents)
      setEvents(normalizedEvents)
      setSelectedEvent(null)
    },
    [rowEvents]
  )

  /**
   * Load initia events (behaves as componentDidMount)
   */
  useEffectOnce(() => {
    handleLoadEvents(initialRange)
  })

  return (
    <>
      <div
        className={cn(classes.loadingContainer, {
          [classes.isLoading]: isLoading
        })}
      >
        <FullCalendar
          height="parent"
          defaultView="dayGridMonth"
          eventLimit
          editable
          header={{
            left: 'today, prev,next, title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={calendarRef}
          events={events}
          datesRender={handleDatesRender}
          eventClick={handleClickEvent}
        />
      </div>
      <EventController
        user={user!}
        event={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        onEventChange={handleCrmEventChange}
      />
    </>
  )
}

const mapStateToProps = ({ user }: IAppState) => ({
  user,
  viewAsUsers: viewAs(user)
})

export const ConnectedGridCalendar = connect<StateProps, {}, Props>(
  mapStateToProps
)(GridCalendarPresentation)

export const GridCalendar = memo(ConnectedGridCalendar)
