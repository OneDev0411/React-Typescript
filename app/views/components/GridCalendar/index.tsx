import React, {
  memo,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  RefObject
} from 'react'
import { connect } from 'react-redux'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { makeStyles, Theme } from '@material-ui/core'

import cn from 'classnames'
// List of full calendar assets
import FullCalendar, {
  EventApi,
  EventInput,
  DatesSetArg,
  EventContentArg
} from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick

import { getCalendar, FilterQuery } from 'models/calendar/get-calendar'
import { updateTask } from 'models/tasks'
import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'

import { IAppState } from 'reducers/index'

import { viewAs } from 'utils/user-teams'

import { CrmEventType } from 'components/Calendar/types'

import { Event } from './components/Event'
import { EventController } from './components/EventController'

// List of basic calendar dependency
import {
  getDateRange,
  shouldRecreateRange,
  Format
} from './helpers/get-date-range'
import { ApiOptions, FetchOptions } from '../Calendar/types'

// helpers
import { normalizeEvents } from './helpers/normalize-events'
import { normalizeEventOnEdit } from './helpers/normalize-event-on-edit'
import { upsertCrmEvents } from '../Calendar/helpers/upsert-crm-events'

// helpers
import { StateProps, SocketUpdate, ActionRef } from './types'

// filter component
import { FilterEvents } from './components/FilterEvents'
import { FilterShape } from './components/FilterEvents/type'
import { INITIAL_FILTERS } from './components/FilterEvents/values'

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

interface Props {
  user?: IUser
  contrariwise?: boolean
  viewAsUsers?: UUID[]
  initialRange?: NumberRange
  associations?: string[]
  actionRef?: RefObject<ActionRef>
}

export const GridCalendarPresentation = ({
  user,
  actionRef,
  viewAsUsers,
  initialRange,
  contrariwise = false,
  associations = []
}: Props) => {
  const classes = useStyles()
  // list of server events
  const [rowEvents, setRowEvents] = useState<ICalendarEvent[]>([])
  // list of current events
  const [events, setEvents] = useState<EventInput[]>([])
  // selected event
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(
    null
  )
  // selected day
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  // request status
  const [isLoading, setIsLoading] = useState(false)

  // current range of fetched events
  const [calendarRange, setCalendarRange] = useState<NumberRange>(
    getDateRange()
  )

  // filter events el
  const [filterEl, setFilterEl] = useState<HTMLButtonElement | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterShape>(INITIAL_FILTERS)

  const handleCloseFilterEvents = () => setFilterEl(null)

  const updateEvents = useCallback(
    (
      nextEvents: ICalendarEvent[],
      filter: typeof activeFilter = activeFilter
    ) => {
      // normalized events for using in full calendar
      const normalizedEvents: EventInput[] = normalizeEvents(nextEvents, filter)

      // update events list
      setRowEvents(nextEvents)
      setEvents(normalizedEvents)
    },
    [activeFilter]
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

        updateEvents(nextEvents)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    },
    [viewAsUsers, associations, rowEvents, updateEvents]
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
  const handleDatesRender = (e: DatesSetArg) => {
    const { view } = e
    const [start, end] = calendarRange

    if (shouldRecreateRange(start * 1000, view.currentStart.getTime())) {
      handleLoadMoreEvents(Format.Previous)
    }

    if (shouldRecreateRange(end * 1000, view.currentEnd.getTime())) {
      handleLoadMoreEvents(Format.Next)
    }
  }
  /**
   * trigger on clicking on a calendar cell
   */
  const handleDayClick = ({
    date,
    dateStr,
    allDay
  }: {
    date: Date
    dateStr: string
    allDay: boolean
  }) => {
    const now = new Date()

    date.setHours(now.getHours(), now.getMinutes(), 0, 0)
    // console.log({ date, dateStr, allDay })
    setSelectedDay(date)
  }

  /**
   * trigger on dropping and dragging an event
   */
  const handleEditEvent = async ({ event }: { event: EventApi }) => {
    try {
      const { start, end } = event
      const currentEvent: ICalendarEvent = event.extendedProps?.rowEvent
      const nextEvent = normalizeEventOnEdit(start!, end!, currentEvent)

      setIsLoading(true)

      const newEvent = await updateTask(nextEvent, CRM_TASKS_QUERY)

      handleCrmEventChange(newEvent, 'updated')
    } catch (e) {
      console.log(e)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * triggers when a crm events update or delete
   */
  const handleCrmEventChange = useCallback(
    (
      event: IEvent | ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>,
      type: CrmEventType
    ) => {
      const nextEvents: ICalendarEvent[] = upsertCrmEvents(
        rowEvents,
        event,
        type
      )

      updateEvents(nextEvents)
      setSelectedEvent(null)
      setSelectedDay(null)
    },
    [rowEvents, updateEvents]
  )

  /**
   * Load initia events (behaves as componentDidMount)
   */
  useEffectOnce(() => {
    handleLoadEvents(initialRange)
  })

  /**
   * sync with google and out look real-time
   */
  useEffect(() => {
    const socket: SocketIOClient.Socket = (window as any).socket

    if (!socket) {
      return
    }

    function handleUpdate({ upserted, deleted }: SocketUpdate) {
      if (upserted.length === 0 && deleted.length === 0) {
        return
      }

      const currentEvents: ICalendarEvent[] =
        deleted.length > 0
          ? rowEvents.filter(e => !deleted.includes(e.id))
          : rowEvents
      const nextEvents =
        upserted.length > 0 ? [...upserted, ...currentEvents] : currentEvents

      updateEvents(nextEvents)
    }

    socket.on('Calendar.Updated', handleUpdate)

    return () => {
      socket.off('Calendar.Updated', handleUpdate)
    }
  })

  useImperativeHandle(actionRef, () => ({
    updateCrmEvents: handleCrmEventChange
  }))

  return (
    <>
      <FilterEvents
        el={filterEl}
        initialFilters={activeFilter}
        setFilter={(v: FilterShape) => {
          setActiveFilter(v)
          updateEvents(rowEvents, v)
        }}
        onClose={handleCloseFilterEvents}
      />
      <div
        className={cn(classes.loadingContainer, {
          [classes.isLoading]: isLoading
        })}
      >
        <FullCalendar
          height="100%"
          initialView="dayGridMonth"
          dayMaxEventRows={3}
          editable
          customButtons={{
            filterButton: {
              text: 'Calendars...',
              click: e => {
                // @ts-ignore
                setFilterEl(e.currentTarget as HTMLButtonElement)
              }
            }
          }}
          headerToolbar={{
            left: 'today prev,next title',
            right: 'filterButton dayGridMonth,timeGridWeek,timeGridDay'
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'List'
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          events={events}
          datesSet={handleDatesRender}
          dateClick={handleDayClick}
          eventDrop={handleEditEvent}
          eventResize={handleEditEvent}
          moreLinkClick="day"
          views={{
            timeGrid: {
              dayMaxEventRows: false
            }
          }}
          eventContent={(content: EventContentArg) => {
            return (
              <Event
                event={content}
                rowEvent={content.event.extendedProps.rowEvent}
                onSelect={setSelectedEvent}
                onChange={handleCrmEventChange}
              />
            )
          }}
        />
      </div>
      <EventController
        user={user!}
        event={selectedEvent}
        day={selectedDay}
        setSelectedEvent={setSelectedEvent}
        setSelectedDay={setSelectedDay}
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
