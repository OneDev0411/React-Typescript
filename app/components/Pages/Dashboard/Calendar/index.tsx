import React, { useRef, useState } from 'react'
import { WithRouterProps } from 'react-router'

import GlobalHeader from 'components/GlobalHeader'

import Calendar from 'components/Calendar'
import { GridCalendar } from 'components/GridCalendar'
import { CalendarRef } from 'components/Calendar/types'

import Filters, {
  FiltersRef,
  DEFAULT_TAB,
  TAB_ITEMS
} from './components/Filters'

import { DatePicker } from './components/DatePicker'

import { useStyles as useCommonStyles } from './use-styles'

export default function CalendarPage(props: WithRouterProps) {
  const classes = useCommonStyles()
  const calendarRef = useRef<CalendarRef>(null)
  const filtersRef = useRef<FiltersRef>(null)

  const [filter, setFilter] = useState(
    (TAB_ITEMS.find(({ link }) => link === props.params.id) || TAB_ITEMS[0])
      .filter
  )

  const handleChangeDate = (date: Date) => {
    calendarRef.current && calendarRef.current.jumpToDate(date)
  }

  const handleCreateEvent = (event: IEvent) => {
    // set filters to All Events when creating a new event
    filtersRef.current!.changeFilter(DEFAULT_TAB)

    calendarRef.current!.updateCrmEvents(event, 'created')
  }

  return (
    <div className={classes.container}>
      <GlobalHeader
        title="Calendar"
        noPadding
        onCreateEvent={handleCreateEvent}
      />

      <div className={classes.topSide}>
        {/* <Filters onChange={setFilter} ref={filtersRef} /> */}
        {/* <DatePicker onChange={handleChangeDate} style={{ margin: '1rem 0' }} /> */}
      </div>

      <div className={classes.listContainer}>
        {/* <Calendar ref={calendarRef} filter={filter} /> */}
        <GridCalendar />
      </div>
    </div>
  )
}
