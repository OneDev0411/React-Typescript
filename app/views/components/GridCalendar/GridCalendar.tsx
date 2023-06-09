import {
  memo,
  useRef,
  useMemo,
  useState,
  RefObject,
  useCallback,
  useImperativeHandle
} from 'react'

import FullCalendar, {
  EventApi,
  EventInput,
  DatesSetArg,
  EventContentArg
} from '@fullcalendar/react'
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid'
// eslint-disable-next-line import/order
import dayGridPlugin from '@fullcalendar/daygrid'
// eslint-disable-next-line import/order
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick

import { makeStyles } from '@material-ui/core'
import _map from 'lodash/map'
import { useDispatch, useSelector } from 'react-redux'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useTeamSetting } from '@app/hooks/team/use-team-setting'
import { useViewAs } from '@app/hooks/team/use-view-as'
import useNotify from '@app/hooks/use-notify'
import { selectUser } from '@app/selectors/user'
import { setActiveTeamSetting } from '@app/store_actions/active-team'
import {
  CrmEventType,
  ApiOptions,
  FetchOptions
} from 'components/ContactProfileTimeline/types'
import { getCalendar, FilterQuery } from 'models/calendar/get-calendar'
import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'
import { updateTask } from 'models/tasks'

import { upsertCrmEvents } from '../ContactProfileTimeline/helpers/upsert-crm-events'

import ChangeView from './components/ChangeView'
import { Event } from './components/Event'
import { EventController } from './components/EventController'
import { FilterEvents } from './components/FilterEvents'
import { FilterShape } from './components/FilterEvents/type'
import {
  CALENDAR_FILTER_EVENTS_KEY,
  INITIAL_FILTERS
} from './components/FilterEvents/values'
import {
  getDateRange,
  shouldRecreateRange,
  Format
} from './helpers/get-date-range'
import getViewName from './helpers/get-view-label'
import { normalizeEventOnEdit } from './helpers/normalize-event-on-edit'
import { normalizeEvents } from './helpers/normalize-events'
import { ActionRef, ViewType } from './types'

const useStyles = makeStyles(
  () => ({
    calendarContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
    }
  }),
  {
    name: 'GridCalendar'
  }
)

const INITIAL_VIEW = 'dayGridMonth'

interface Props {
  contrariwise?: boolean
  initialRange?: ICalendarRange
  associations?: string[]
  actionRef?: RefObject<ActionRef>
}

const GridCalendarPresentation = ({
  actionRef,
  initialRange,
  contrariwise = false,
  associations = []
}: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const notify = useNotify()
  const user = useSelector(selectUser)
  const viewAsUsers = useViewAs()
  const calendarRef = useRef<FullCalendar>(null)
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
  const [calendarRange, setCalendarRange] = useState<ICalendarRange>(
    getDateRange()
  )

  // filter events el
  const [filterEl, setFilterEl] = useState<HTMLButtonElement | null>(null)

  // change view events el
  const [viewEl, setViewEl] = useState<HTMLButtonElement | null>(null)

  const selectedView = useMemo(() => {
    return (calendarRef.current?.getApi().view.type as ViewType) || INITIAL_VIEW
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarRef.current?.getApi().view.type])

  const activeFilter: FilterShape = useTeamSetting(
    CALENDAR_FILTER_EVENTS_KEY,
    INITIAL_FILTERS
  )

  const handleCloseFilterEvents = () => setFilterEl(null)
  const handleCloseChangeView = () => setViewEl(null)

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
            apiOptions.range.low * 1000
          ).toUTCString()} %c${new Date(
            apiOptions.range.high * 1000
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
          associations: [
            'calendar_event.people',
            'calendar_event.full_crm_task',
            'crm_task.reminders',
            ...associations
          ],
          ...apiOptions
        })

        const nextEvents: ICalendarEvent[] = options.reset
          ? fetchedEvents
          : fetchedEvents.concat(rowEvents)

        updateEvents(nextEvents, activeFilter)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    },
    [viewAsUsers, associations, rowEvents, updateEvents, activeFilter]
  )

  const handleLoadEvents = async (range: Nullable<ICalendarRange> = null) => {
    const query: ICalendarRange = range || calendarRange

    // reset calendar range
    setCalendarRange(query)

    await fetchEvents(
      {
        range: query,
        position: 'Middle'
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
      query: ICalendarRange
      calendar: ICalendarRange
    } => {
      let actualDirection = direction

      if (contrariwise && direction === Format.Next) {
        actualDirection = Format.Previous
      }

      if (contrariwise && direction === Format.Previous) {
        actualDirection = Format.Next
      }

      const query: ICalendarRange =
        actualDirection === Format.Next
          ? getDateRange(calendarRange.high * 1000, Format.Next)
          : getDateRange(calendarRange.low * 1000, Format.Previous)

      const calendar: ICalendarRange =
        actualDirection === Format.Next
          ? { low: calendarRange.low, high: query.high }
          : { low: query.low, high: calendarRange.high }

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
        range: query,
        position: 'Next'
      })
    },
    [createRanges, fetchEvents, isLoading]
  )

  /**
   * trigger on layout chnage
   */
  const handleDatesRender = (e: DatesSetArg) => {
    const { view } = e
    const { low, high } = calendarRange

    if (shouldRecreateRange(low * 1000, view.currentStart.getTime())) {
      handleLoadMoreEvents(Format.Previous)
    }

    if (shouldRecreateRange(high * 1000, view.currentEnd.getTime())) {
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
      notify({
        status: 'success',
        message: 'Event updated!'
      })
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
      let changeType = type

      if (type === 'updated' && viewAsUsers?.length > 1) {
        const assignees: UUID[] = _map(event.assignees, 'id')
        const shouldVisible = viewAsUsers.some(userId =>
          assignees.includes(userId)
        )

        if (!shouldVisible) {
          changeType = 'deleted'
        }
      }

      const nextEvents: ICalendarEvent[] = upsertCrmEvents(
        rowEvents,
        event,
        changeType
      )

      updateEvents(nextEvents)
      setSelectedEvent(null)
      setSelectedDay(null)
    },
    [rowEvents, updateEvents, viewAsUsers]
  )

  /**
   * handle filter change
   */
  const handleFilterEvents = (value: FilterShape) => {
    dispatch(setActiveTeamSetting(CALENDAR_FILTER_EVENTS_KEY, value))
    updateEvents(rowEvents, value)
  }

  /**
   * handle view change
   */
  const handleChangeView = (view: ViewType) => {
    calendarRef.current?.getApi().changeView(view)
  }

  /**
   * Load initial events (behaves as componentDidMount)
   */
  useEffectOnce(() => {
    handleLoadEvents(initialRange)

    const reload = () => {
      console.log('[ Calendar ] Reloading')
      handleLoadEvents(calendarRange)
    }

    window.socket?.on('crm_task:create', reload)
    window.socket?.on('crm_task:delete', reload)
    window.socket?.on('Calendar.Updated', reload)

    return () => {
      window.socket?.off('crm_task:create', reload)
      window.socket?.off('crm_task:delete', reload)
      window.socket?.off('Calendar.Updated', reload)
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
        setFilter={handleFilterEvents}
        onClose={handleCloseFilterEvents}
      />
      <ChangeView
        el={viewEl}
        selectedView={selectedView}
        onChangeView={handleChangeView}
        onClose={handleCloseChangeView}
      />
      <div className={classes.calendarContainer}>
        <FullCalendar
          ref={calendarRef}
          height="100%"
          initialView={INITIAL_VIEW}
          dayMaxEventRows={3}
          editable={!isLoading}
          events={events}
          datesSet={handleDatesRender}
          dateClick={handleDayClick}
          eventDrop={handleEditEvent}
          eventResize={handleEditEvent}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          moreLinkClick="day"
          customButtons={{
            filterButton: {
              text: 'Filter',
              click: e => {
                // @ts-ignore
                setFilterEl(e.currentTarget as HTMLButtonElement)
              }
            },
            viewButton: {
              text: getViewName(selectedView),
              click: e => {
                setViewEl(e.currentTarget as HTMLButtonElement)
              }
            }
          }}
          headerToolbar={{
            left: 'today prev,next title',
            right: 'filterButton viewButton'
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'List'
          }}
          plugins={[
            rrulePlugin,
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin
          ]}
          views={{
            dayGridDay: {
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
        user={user}
        event={selectedEvent}
        day={selectedDay}
        setSelectedEvent={setSelectedEvent}
        setSelectedDay={setSelectedDay}
        onEventChange={handleCrmEventChange}
      />
    </>
  )
}

const GridCalendar = memo(GridCalendarPresentation)

export default GridCalendar
