import React, { useState, useEffect, useRef } from 'react'

import { LoadingPosition } from 'components/VirtualList'

import { useLoadCalendar } from './hooks/use-load-calendar'
import { getDateRange, Format } from './helpers/get-date-range'
import { createListRows } from './helpers/create-list-rows'

import List from './components/List'

interface Ranges {
  query: NumberRange
  calendar: NumberRange
}

interface Props {
  range: NumberRange
  children: React.ReactNode
  onChangeActiveDate: (activeDate: Date) => void
}

const Calendar: React.FC = (props: Props) => {
  // holds the reference to the Virtual List
  const listRef = useRef(null)

  // rows of Virtual List
  const [rows, setRows] = useState([])

  /*
   * holds the required ranges of calendar:
   * query: the range of latest query
   * calendar: range of fetched calendar
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
      onChangeActiveDate={props.onChangeActiveDate}
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

export default Calendar
