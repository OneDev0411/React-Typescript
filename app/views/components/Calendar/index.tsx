import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  RefObject,
  ComponentProps,
  useImperativeHandle
} from 'react'
import { connect } from 'react-redux'

import { IAppState } from 'reducers'

import { LoadingPosition, VirtualListRef } from 'components/VirtualList'

import { useLoadCalendar } from './hooks/use-load-calendar'
import { getDateRange, Format } from './helpers/get-date-range'
import { createListRows } from './helpers/create-list-rows'

import List from './components/List'
import { getRowIdByDate } from './helpers/get-row-by-date'

export interface CalendarRef {
  jumpToDate(date: Date): void
}

interface Ranges {
  query: NumberRange
  calendar: NumberRange
}

interface Props {
  user?: IUser
  calendarRef?: RefObject<CalendarRef>
  onChangeActiveDate?: (activeDate: Date) => void
}

interface StateProps {
  user: IUser
}

export function Calendar({
  calendarRef,
  onChangeActiveDate = () => null
}: Props) {
  // holds a reference to the Virtual List
  const listRef = useRef<VirtualListRef>(null)

  // rows of Virtual List
  const [rows, setRows] = useState<any>([])

  /*
   * holds the required ranges of calendar:
   * query: the range of latest query
   * calendar: the range of current fetched calendar
   */
  const [ranges, setRanges] = useState<Ranges>(getInitialRanges())

  // latest loading position of calendar
  const [loadingPosition, setLoadingPosition] = useState<LoadingPosition>(
    LoadingPosition.Middle
  )

  const { events, isLoading } = useLoadCalendar({
    range: ranges.query
    // users: viewAsUsers
  })

  useEffect(() => setRows(createListRows(events)), [events, ranges.calendar])

  const jumpToDate = (date: Date): void => {
    const rowId = getRowIdByDate(
      date,
      rows,
      Object.keys(events),
      ranges.calendar
    )

    if (rowId === -1) {
      // todo
      return
    }

    listRef.current!.scrollToItem(rowId, 'start')

    // change active date
    onChangeActiveDate(new Date(rows[rowId].title))
  }

  /**
   * exposes below methods to be accessible outside of the component
   */
  useImperativeHandle(calendarRef, () => ({
    jumpToDate
  }))

  /**
   * handles updating ranges when user is trying to fetch future events
   */
  const handleLoadNextEvents = (): void => {
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
      calendar
    })
  }

  /**
   * handles updating ranges when user is trying to fetch past events
   */
  const handleLoadPreviousEvents = (): void => {
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
      calendar
    })
  }

  return (
    <List
      ref={listRef}
      rows={rows}
      isLoading={isLoading}
      loadingPosition={loadingPosition}
      onReachEnd={handleLoadNextEvents}
      onReachStart={handleLoadPreviousEvents}
      onChangeActiveDate={onChangeActiveDate}
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
    calendar: date
  }
}

function mapStateToProps(state: IAppState) {
  return {
    user: state.user
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
