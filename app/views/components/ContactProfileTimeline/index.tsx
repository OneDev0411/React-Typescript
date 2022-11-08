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

import { getCalendar } from 'models/calendar/get-calendar'
import { IAppState } from 'reducers/index'
import { viewAs } from 'utils/user-teams'

import { CalendarList } from './components/List'
import { createListRows } from './helpers/create-list-rows'
import { getDateRangeFromEvent, Format } from './helpers/get-date-range'
import { normalizeEvents } from './helpers/normalize-events'
import { updateEmailCampaign } from './helpers/update-email-campaign'
import { upsertCrmEvents } from './helpers/upsert-crm-events'
import { CalendarRef, ApiOptions, CrmEventType } from './types'

const MAX_LIMIT_EVENT = 10

interface Props {
  filter?: object
  contact?: IContact
  associations?: string[]
  calendarRef?: RefObject<CalendarRef>
  onLoadEvents?: (events: ICalendarEventsList, range: ICalendarRange) => void
  eventType?: 'upcoming' | 'history'
}

export function Calendar({
  eventType,
  calendarRef,
  contact,
  filter = {},
  associations = [],
  onLoadEvents = () => null
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState<ICalendarEvent[]>([])
  const [listRows, setListRows] = useState<ICalendarListRow[]>([])
  const [calendarRange, setCalendarRange] = useState<ICalendarRange>(() => {
    const current = new Date().getTime() / 1000

    return {
      low: current,
      high: current
    }
  })
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
    handleLoadEvents()
  })

  const fetchEvents = useCallback(
    async (
      range: ICalendarRange,
      position: ApiOptions['position']
    ): Promise<ICalendarEvent[] | undefined> => {
      const { low = calendarRange.low, high = calendarRange.high } = range

      console.log('fetchEvents', range, position)

      const commonParams = {
        users: viewAsUsers,
        filter,
        associations: ['calendar_event.people', ...associations],
        limit: MAX_LIMIT_EVENT
      }
      const loadOldEventsPayload = {
        ...commonParams,
        range: { high }
      }
      const loadNewEventsPayload = {
        ...commonParams,
        range: { low }
      }

      try {
        if (position === 'Next') {
          let newEvents = await getCalendar(loadNewEventsPayload)

          if (MAX_LIMIT_EVENT > newEvents.length) {
            setIsReachedEnd(true)
          }

          console.log('next', newEvents)

          return [...events, ...newEvents]
        }

        if (position === 'Previous') {
          let oldEvents = await getCalendar(loadOldEventsPayload)

          if (MAX_LIMIT_EVENT > oldEvents.length) {
            setIsReachedStart(true)
          }

          console.log('Previous', oldEvents)

          return [...events, ...oldEvents]
        }

        if (eventType === 'upcoming') {
          const events = await getCalendar(loadNewEventsPayload)

          if (MAX_LIMIT_EVENT > events.length) {
            setIsReachedEnd(true)
          }

          console.log('upcoming', events)

          return events
        }

        if (eventType === 'history') {
          const events = await getCalendar(loadOldEventsPayload)

          if (MAX_LIMIT_EVENT > events.length) {
            setIsReachedStart(true)
          }

          console.log('history', events)

          return events
        }
      } catch (error) {
        throw error
      }
    },
    [
      associations,
      calendarRange.high,
      calendarRange.low,
      eventType,
      events,
      filter,
      viewAsUsers
    ]
  )
  const getEvents = useCallback(
    async (
      option: Pick<ApiOptions, 'range' | 'position'>,
      reset: boolean = false
    ) => {
      try {
        // enable loading flag
        setIsLoading(true)

        const { range, position } = option

        console.log('getEvents', range, position)

        // fetch calendar data from server based on given parameters
        const events = await fetchEvents(range, position)

        if (events) {
          // get current range of fetched calendar
          const normalizedEvents = normalizeEvents(events, range)

          // update events list
          setEvents(events)

          // updates virtual list rows
          if (normalizedEvents) {
            setListRows(createListRows(normalizedEvents))
            onLoadEvents(normalizedEvents, range)
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    },
    [fetchEvents, onLoadEvents]
  )

  const handleLoadEvents = async (
    reset: boolean = true,
    range: Nullable<Partial<ICalendarRange>> = {}
  ) => {
    const nextRange: ICalendarRange = {
      high: range?.high ?? calendarRange.high,
      low: range?.low ?? calendarRange.low
    }

    if (reset) {
      setIsReachedStart(false)
      setIsReachedEnd(false)
    }

    await getEvents(
      {
        range: nextRange,
        position: 'Middle'
      },
      reset
    )
  }

  const createRanges = useCallback(
    (direction: Format = Format.Middle): ICalendarRange => {
      if (events.length === 0 || direction === Format.Middle) {
        return calendarRange
      }

      const currentRange = { ...calendarRange }

      if (direction === Format.Next) {
        currentRange.low = getDateRangeFromEvent(
          events[events.length - 1],
          direction
        )
      }

      if (direction === Format.Previous) {
        currentRange.high = getDateRangeFromEvent(events[0], direction)
      }

      return currentRange
    },
    [calendarRange, events]
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

    const range = createRanges(Format.Next)

    setCalendarRange(range)
    getEvents({
      range,
      position: 'Next'
    })
  }, [createRanges, getEvents, isLoading, isReachedEnd])

  const handleLoadPreviousEvents = useCallback((): void => {
    if (isLoading || isReachedStart) {
      return
    }

    const range = createRanges(Format.Previous)

    setCalendarRange(range)
    getEvents({
      range,
      position: 'Previous'
    })
  }, [createRanges, getEvents, isLoading, isReachedStart])

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
      eventType={eventType}
    />
  )
}

export default forwardRef(
  (props: ComponentProps<typeof Calendar>, ref: RefObject<CalendarRef>) => (
    <Calendar {...props} calendarRef={ref} />
  )
)
