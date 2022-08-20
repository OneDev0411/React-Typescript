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
import { concatEvents } from './helpers/concat-events'
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
}

export function Calendar({
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
    ): Promise<[ICalendarEvent[], ICalendarEvent[]]> => {
      const { low, high } = range
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
        if (position === 'Previous') {
          const events = await getCalendar(loadOldEventsPayload)

          if (MAX_LIMIT_EVENT > events.length) {
            setIsReachedStart(true)
          }

          return [events, []]
        }

        if (position === 'Next') {
          const events = await getCalendar(loadNewEventsPayload)

          if (MAX_LIMIT_EVENT > events.length) {
            setIsReachedEnd(true)
          }

          return [[], events]
        }

        const events = await Promise.all([
          await getCalendar(loadOldEventsPayload),
          await getCalendar(loadNewEventsPayload)
        ])

        if (MAX_LIMIT_EVENT > events[0].length) {
          setIsReachedStart(true)
        }

        if (MAX_LIMIT_EVENT > events[1].length) {
          setIsReachedEnd(true)
        }

        return events
      } catch (error) {
        throw error
      }
    },
    [associations, filter, viewAsUsers]
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

        // fetch calendar data from server based on given parameters
        const [prevEvents, nextEvents] = await fetchEvents(range, position)

        const newEvents = concatEvents(
          {
            events,
            prevEvents,
            nextEvents
          },
          reset
        )
        // get current range of fetched calendar
        const normalizedEvents = normalizeEvents(newEvents, range)

        // update events list
        setEvents(newEvents)
        // updates virtual list rows
        setListRows(createListRows(normalizedEvents))

        onLoadEvents(normalizedEvents, range)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    },
    [fetchEvents, events, onLoadEvents]
  )

  const handleLoadEvents = async (reset: boolean = true) => {
    await getEvents(
      {
        range: calendarRange,
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
    refresh: () => handleLoadEvents(false),
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
