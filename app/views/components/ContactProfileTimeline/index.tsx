import {
  useState,
  forwardRef,
  RefObject,
  useImperativeHandle,
  ComponentProps,
  useCallback
} from 'react'

import { useSelector } from 'react-redux'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import useNotify from '@app/hooks/use-notify'
import { getCalendar } from 'models/calendar/get-calendar'
import { IAppState } from 'reducers/index'
import { viewAs } from 'utils/user-teams'

import { CalendarList } from './components/List'
import { createListRows } from './helpers/create-list-rows'
import { getDateRange, Format } from './helpers/get-date-range'
import { normalizeEvents } from './helpers/normalize-events'
import { updateEmailCampaign } from './helpers/update-email-campaign'
import { upsertCrmEvents } from './helpers/upsert-crm-events'
import { CalendarRef, ApiOptions, FetchOptions, CrmEventType } from './types'

interface Props {
  filter?: object
  contact?: IContact
  associations?: string[]
  calendarRef?: RefObject<CalendarRef>
  initialRange?: NumberRange
  contrariwise?: boolean
  onLoadEvents?: (events: ICalendarEventsList, range: NumberRange) => void
}

export function Calendar({
  calendarRef,
  initialRange,
  contact,
  filter = {},
  contrariwise = false,
  associations = [],
  onLoadEvents = () => null
}: Props) {
  const notify = useNotify()
  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState<ICalendarEvent[]>([])
  const [listRows, setListRows] = useState<ICalendarListRow[]>([])
  const [calendarRange, setCalendarRange] = useState<NumberRange>(
    getDateRange()
  )
  const [isReachedStart, setIsReachedStart] = useState(false)
  const [isReachedEnd, setIsReachedEnd] = useState(false)

  const { user, viewAsUsers } = useSelector<
    IAppState,
    { user: IUser; viewAsUsers: UUID[] }
  >(({ user, activeTeam }) => ({
    user: user!,
    viewAsUsers: viewAs(activeTeam)
  }))

  useEffectOnce(() => {
    handleLoadEvents(new Date(), initialRange)
  })

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

        if (fetchedEvents.length === 0 && apiOptions.position !== 'Middle') {
          notify({
            status: 'success',
            message: 'There is no more events to load'
          })

          if (apiOptions.position === 'Next') {
            setIsReachedEnd(true)
          }

          if (apiOptions.position === 'Previous') {
            setIsReachedStart(true)
          }
        }

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
    [associations, events, filter, viewAsUsers, notify, onLoadEvents]
  )

  const handleLoadEvents = async (
    date: Date,
    range: NumberRange | null = null
  ) => {
    const query: NumberRange =
      range || getDateRange(date.getTime(), Format.Middle)

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

  const createListFromEvents = useCallback(
    (events: ICalendarEvent[]) => {
      const normalizedEvents = normalizeEvents(events, calendarRange)

      setEvents(events)
      setListRows(createListRows(normalizedEvents))
    },
    [calendarRange]
  )

  const handleCrmEventChange = useCallback(
    (event: IEvent, type: CrmEventType) => {
      const nextEvents = upsertCrmEvents(events, event, type, contact)

      createListFromEvents(nextEvents)
    },
    [contact, createListFromEvents, events]
  )

  const handleScheduledEmailChange = useCallback(
    (event: ICalendarEvent, emailCampaign: IEmailCampaign) => {
      const nextEvents = updateEmailCampaign(events, event, emailCampaign)

      createListFromEvents(nextEvents)
    },
    [createListFromEvents, events]
  )

  const handleLoadNextEvents = useCallback((): void => {
    if (isLoading || isReachedEnd) {
      return
    }

    const { query, calendar: nextCalendarRange } = createRanges(Format.Next)

    setCalendarRange(nextCalendarRange)
    fetchEvents(
      {
        range: query,
        position: 'Next'
      },
      {
        calendarRange: nextCalendarRange
      }
    )
  }, [createRanges, fetchEvents, isLoading, isReachedEnd])

  const handleLoadPreviousEvents = useCallback((): void => {
    if (isLoading || isReachedStart) {
      return
    }

    const { query, calendar: nextCalendarRange } = createRanges(Format.Previous)

    setCalendarRange(nextCalendarRange)
    fetchEvents(
      {
        range: query,
        position: 'Previous'
      },
      {
        calendarRange: nextCalendarRange
      }
    )
  }, [createRanges, fetchEvents, isLoading, isReachedStart])

  /**
   * exposes below methods to be accessible outside of the component
   */
  useImperativeHandle(calendarRef, () => ({
    refresh: handleLoadEvents,
    updateCrmEvents: handleCrmEventChange
  }))

  return (
    <CalendarList
      rows={listRows}
      user={user}
      contact={contact}
      isLoading={isLoading}
      isReachedStart={isReachedStart}
      isReachedEnd={isReachedEnd}
      onLoadNextEvents={handleLoadNextEvents}
      onLoadPreviousEvents={handleLoadPreviousEvents}
      onCrmEventChange={handleCrmEventChange}
      onScheduledEmailChange={handleScheduledEmailChange}
    />
  )
}

export default forwardRef(
  (props: ComponentProps<typeof Calendar>, ref: RefObject<CalendarRef>) => (
    <Calendar {...props} calendarRef={ref} />
  )
)
