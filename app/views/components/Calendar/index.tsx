import {
  useState,
  useEffect,
  forwardRef,
  RefObject,
  ComponentProps,
  useCallback
} from 'react'
import { connect } from 'react-redux'
import useDebouncedCallback from 'use-debounce/lib/callback'
import usePrevious from 'react-use/lib/usePrevious'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { IAppState } from 'reducers/index'

import { getCalendar } from 'models/calendar/get-calendar'

import { viewAs } from 'utils/user-teams'

import { IUserState } from 'reducers/user'

import {
  CalendarRef,
  ApiOptions,
  FetchOptions,
  Placeholder,
  LoadingDirection,
  CrmEventType
} from './types'

import { getDateRange, Format } from './helpers/get-date-range'
import { createListRows } from './helpers/create-list-rows'
import { upsertCrmEvents } from './helpers/upsert-crm-events'
import { updateEmailCampaign } from './helpers/update-email-campaign'
import { normalizeEvents } from './helpers/normalize-events'

import { CalendarList } from './components/List'

interface Props {
  viewAsUsers?: UUID[]
  filter?: object
  contact?: IContact
  associations?: string[]
  calendarRef?: RefObject<CalendarRef>
  user?: IUser
  initialRange?: NumberRange
  contrariwise?: boolean
  placeholders?: Placeholder[]
  directions?: LoadingDirection[]
  onChangeActiveDate?: (activeDate: Date) => void
  onLoadEvents?: (events: ICalendarEventsList, range: NumberRange) => void
}

interface StateProps {
  viewAsUsers: UUID[]
  user: IUserState
}

interface SocketUpdate {
  upserted: ICalendarEvent[]
  deleted: UUID[]
}

export function Calendar({
  calendarRef,
  viewAsUsers,
  initialRange,
  user,
  contact,
  directions = [LoadingDirection.Top, LoadingDirection.Bottom],
  placeholders = [Placeholder.Month, Placeholder.Day],
  filter = {},
  contrariwise = false,
  associations = [],
  onLoadEvents = () => null,
  onChangeActiveDate = () => null
}: Props) {
  const previousProps = usePrevious<Partial<Props>>({ viewAsUsers, filter })

  // fetches events so far
  const [events, setEvents] = useState<ICalendarEvent[]>([])

  // rows of Virtual List
  const [listRows, setListRows] = useState<ICalendarListRow[]>([])

  // check whether api is loading events or not
  const [isLoading, setIsLoading] = useState(false)

  // current active date
  const [activeDate, setActiveDate] = useState<Date>(new Date())

  // current range of fetched calendar
  const [calendarRange, setCalendarRange] = useState<NumberRange>(
    getDateRange()
  )
  // create a debounced function for setActiveDate
  const [debouncedSetActiveDate] = useDebouncedCallback(setActiveDate, 500)

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

        // fetch calendar data from server based on given parameters
        const fetchedEvents = await getCalendar({
          users: viewAsUsers,
          filter,
          associations: ['calendar_event.people', ...associations],
          ...apiOptions
        })

        const nextEvents: ICalendarEvent[] = options.reset
          ? fetchedEvents
          : fetchedEvents.concat(events)

        // get current range of fetched calendar
        const range = options.calendarRange || apiOptions.range

        const normalizedEvents = normalizeEvents(nextEvents, range)

        // update events list
        setEvents(nextEvents)

        // updates virtual list rows
        setListRows(createListRows(normalizedEvents))

        onLoadEvents(normalizedEvents, range)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    },
    [viewAsUsers, filter, associations, events, onLoadEvents]
  )

  /**
   * triggers when active date changes in virtual list
   */
  const handleChangeActiveDate = useCallback(
    (date: Date) => {
      debouncedSetActiveDate(date)
      onChangeActiveDate(date)
    },
    [debouncedSetActiveDate, onChangeActiveDate]
  )

  /**
   * handles updating ranges when given date is outside of current
   * calendar range
   * @param date
   */
  const handleLoadEvents = async (
    date: Date = activeDate,
    range: NumberRange | null = null
  ) => {
    const query: NumberRange =
      range || getDateRange(date.getTime(), Format.Middle)

    // reset calendar range
    setCalendarRange(query)

    // set active date
    setActiveDate(date)

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
  const handleLoadNextEvents = useCallback((): void => {
    if (isLoading || !directions.includes(LoadingDirection.Bottom)) {
      return
    }

    const { query, calendar: nextCalendarRange } = createRanges(Format.Next)

    setCalendarRange(nextCalendarRange)

    fetchEvents(
      {
        range: query
      },
      {
        calendarRange: nextCalendarRange
      }
    )
  }, [createRanges, directions, fetchEvents, isLoading])

  /**
   * handles updating ranges when user is trying to fetch past events
   */
  const handleLoadPreviousEvents = useCallback((): void => {
    if (isLoading || !directions.includes(LoadingDirection.Top)) {
      return
    }

    const { query, calendar: nextCalendarRange } = createRanges(Format.Previous)

    setCalendarRange(nextCalendarRange)

    fetchEvents(
      {
        range: query
      },
      {
        calendarRange: nextCalendarRange
      }
    )
  }, [createRanges, directions, fetchEvents, isLoading])

  /**
   * creates the list of virtual list rows based on given events
   * @param events
   */
  const createListFromEvents = useCallback(
    (events: ICalendarEvent[]) => {
      const normalizedEvents = normalizeEvents(events, calendarRange)

      setEvents(events)
      setListRows(createListRows(normalizedEvents))
    },
    [calendarRange]
  )

  /**
   * triggers when a crm events update or delete
   */
  const handleCrmEventChange = useCallback(
    (event: IEvent, type: CrmEventType) => {
      const nextEvents = upsertCrmEvents(events, event, type, contact)

      createListFromEvents(nextEvents)
    },
    [contact, createListFromEvents, events]
  )

  /**
   * triggers when an email campaign updates
   */
  const handleScheduledEmailChange = useCallback(
    (event: ICalendarEvent, emailCampaign: IEmailCampaign) => {
      const nextEvents = updateEmailCampaign(events, event, emailCampaign)

      createListFromEvents(nextEvents)
    },
    [createListFromEvents, events]
  )

  /**
   * behaves as componentDidMount
   */
  useEffectOnce(() => {
    handleLoadEvents(activeDate, initialRange)
  })

  /**
   * calls when contrariwise prop changes
   */
  useEffect(() => {
    if (previousProps && previousProps.contrariwise !== contrariwise) {
      handleLoadEvents(activeDate, initialRange)
    }
    // eslint-disable-next-line
  }, [contrariwise])

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
          ? events.filter(e => !deleted.includes(e.id))
          : events
      const nextEvents =
        upserted.length > 0 ? [...upserted, ...currentEvents] : currentEvents

      const normalizedEvents = normalizeEvents(nextEvents, calendarRange)

      const nextRows = createListRows(normalizedEvents)

      // update events list
      setEvents(nextEvents)

      setListRows(nextRows)
    }

    socket.on('Calendar.Updated', handleUpdate)

    return () => {
      socket.off('Calendar.Updated', handleUpdate)
    }
  })

  return (
    <CalendarList
      rows={listRows}
      user={user!}
      contact={contact}
      isLoading={isLoading}
      onReachEnd={handleLoadNextEvents}
      onReachStart={handleLoadPreviousEvents}
      onChangeActiveDate={handleChangeActiveDate}
      onCrmEventChange={handleCrmEventChange}
      onScheduledEmailChange={handleScheduledEmailChange}
    />
  )
}

function mapStateToProps({ user }: IAppState) {
  return {
    user,
    viewAsUsers: viewAs(user)
  }
}

const ConnectedCalendar = connect<StateProps, {}, Props>(mapStateToProps)(
  Calendar
)

export default forwardRef(
  (
    props: ComponentProps<typeof ConnectedCalendar>,
    ref: RefObject<CalendarRef>
  ) => <ConnectedCalendar {...props} calendarRef={ref} />
)
