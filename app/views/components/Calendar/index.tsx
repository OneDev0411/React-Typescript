import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  RefObject,
  ComponentProps,
  useImperativeHandle,
  useCallback
} from 'react'
import { connect } from 'react-redux'
import useDebouncedCallback from 'use-debounce/lib/callback'

import { IAppState } from 'reducers'

import {
  viewAs,
  // getActiveTeamACL,
  getTeamAvailableMembers,
  getActiveTeam
} from 'utils/user-teams'

import { LoadingPosition, VirtualListRef } from 'components/VirtualList'

import { useLoadCalendar } from './hooks/use-load-calendar'
import { getDateRange, Format } from './helpers/get-date-range'
import { createListRows } from './helpers/create-list-rows'
import { upsertCrmEvents } from './helpers/upsert-crm-events'

import List from './components/List'
import { getRowIdByDate } from './helpers/get-row-by-date'

export interface CalendarRef {
  jumpToDate(date: Date): void
  refresh(date: Date): void
  updateCrmEvents(event: IEvent, type: string): void
}

interface Ranges {
  query: NumberRange
  calendar: NumberRange
  format: Format
}

interface Props {
  viewAsUsers?: UUID[]
  calendarRef?: RefObject<CalendarRef>
  onChangeActiveDate?: (activeDate: Date) => void
}

interface StateProps {
  viewAsUsers: UUID[]
}

export function Calendar({
  calendarRef,
  viewAsUsers,
  onChangeActiveDate = () => null
}: Props) {
  // reference to the Virtual List
  const listRef = useRef<VirtualListRef>(null)

  // holds current active date
  const [activeDate, setActiveDate] = useState<Date>(new Date())
  const [debouncedSetActiveDate] = useDebouncedCallback(setActiveDate, 500)

  // rows of Virtual List
  const [rows, setRows] = useState<any>([])

  /*
   * the required ranges of calendar:
   * query: the range of latest query
   * calendar: the range of current fetched calendar
   */
  const [ranges, setRanges] = useState<Ranges>(getInitialRanges())

  // latest loading position of calendar
  const [loadingPosition, setLoadingPosition] = useState<LoadingPosition>(
    LoadingPosition.Middle
  )

  const { events, isLoading, updateEvents } = useLoadCalendar(
    {
      range: ranges.query,
      users: viewAsUsers
    },
    {
      reset: ranges.format === Format.Middle
    }
  )

  /**
   * jumps to the given date.
   * @param date
   */
  const jumpToDate = (date: Date, allowSeeking: boolean = true): void => {
    const rowId = getRowIdByDate(
      date,
      rows,
      Object.keys(events),
      ranges.calendar,
      allowSeeking
    )

    if (rowId === -1) {
      // try to jump to the date by fetching more data from server
      allowSeeking && handleLoadEvents(date)

      return
    }

    listRef.current!.scrollToItem(rowId, 'start')

    // change active date
    handleChangeActiveDate(new Date(rows[rowId].date))
  }

  /**
   * triggers when updating rows
   */
  const onUpdateRows = () => jumpToDate(activeDate, false)

  // triggers when new events loading or range of calendar changes
  useEffect(() => {
    setRows(createListRows(events))
  }, [events, ranges.calendar])

  // triggers when updating rows
  useEffect(onUpdateRows, [rows])

  /**
   * exposes below methods to be accessible outside of the component
   */
  useImperativeHandle(calendarRef, () => ({
    jumpToDate,
    refresh: handleLoadEvents,
    updateCrmEvents: handleCrmEventChange
  }))

  /**
   * handles updating ranges when user is trying to fetch future events
   */
  const handleLoadNextEvents = useCallback((): void => {
    if (isLoading) {
      return
    }

    // new range will be from end range of current calendar till next range
    const query: NumberRange = getDateRange(
      ranges.calendar[1] * 1000,
      Format.Next
    )

    // new range will be from start of calendar until end of new query range
    const calendar: NumberRange = [ranges.calendar[0], query[1]]

    // the loading indicator will be shown at the bottom of list
    setLoadingPosition(LoadingPosition.Bottom)

    setRanges({
      query,
      calendar,
      format: Format.Next
    })
  }, [isLoading, ranges.calendar])

  /**
   * handles updating ranges when user is trying to fetch past events
   */
  const handleLoadPreviousEvents = useCallback((): void => {
    if (isLoading) {
      return
    }

    // new range will be from start range of current calendar
    const query: NumberRange = getDateRange(
      ranges.calendar[0] * 1000,
      Format.Previous
    )

    // new range will be from start of new range until end of new calendar range
    const calendar: NumberRange = [query[0], ranges.calendar[1]]

    // the loading indicator will be shown at the top of list
    setLoadingPosition(LoadingPosition.Top)

    setRanges({
      query,
      calendar,
      format: Format.Previous
    })
  }, [isLoading, ranges.calendar])

  /**
   * handles updating ranges when given date is outside of current
   * calendar range
   * @param date
   */
  const handleLoadEvents = (date: Date = new Date()) => {
    const query: NumberRange = getDateRange(date.getTime(), Format.Middle)

    setActiveDate(date)

    setRanges({
      query,
      calendar: query,
      format: Format.Middle
    })
  }

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
   * triggers when a crm events update or delete
   */
  const handleCrmEventChange = useCallback(
    (event: IEvent, type: string) =>
      updateEvents(upsertCrmEvents(events, event, type) as CalendarEventsList),
    [events, updateEvents]
  )

  return (
    <List
      ref={listRef}
      rows={rows}
      isLoading={isLoading}
      loadingPosition={loadingPosition}
      onReachEnd={handleLoadNextEvents}
      onReachStart={handleLoadPreviousEvents}
      onChangeActiveDate={handleChangeActiveDate}
      onCrmEventChange={handleCrmEventChange}
    />
  )
}

/**
 * returns initial range of query and calendar
 */
function getInitialRanges(): Ranges {
  const date = getDateRange()

  return {
    query: date,
    calendar: date,
    format: Format.Middle
  }
}

function mapStateToProps({ user }: IAppState) {
  const teamMembers = getTeamAvailableMembers(getActiveTeam(user))
  const viewAsUsers = viewAs(user)

  return {
    viewAsUsers: viewAsUsers.length === teamMembers.length ? [] : viewAsUsers
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
