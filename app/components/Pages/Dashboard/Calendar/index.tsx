import React, { useRef, useState } from 'react'
import { WithRouterProps } from 'react-router'

import GlobalHeader from 'components/GlobalHeader'

import List from 'components/Calendar'
import { CalendarRef } from 'components/Calendar/types'

import { Filters, TAB_ITEMS } from './components/Filters'

import { DatePicker } from './components/DatePicker'

import { useStyles as useCommonStyles } from './use-styles'

export default function CalendarPage(props: WithRouterProps) {
  const classes = useCommonStyles()
  const calendarRef = useRef<CalendarRef>(null)
  const [filter, setFilter] = useState(
    (TAB_ITEMS.find(({ link }) => link === props.params.id) || TAB_ITEMS[0])
      .filter
  )

  const handleChangeDate = (date: Date) => {
    calendarRef.current && calendarRef.current.jumpToDate(date)
  }

  return (
    <div className={classes.container}>
      <div className={classes.topSide}>
        <GlobalHeader title="Calendar" />
        <Filters onChange={setFilter} />
        <DatePicker onChange={handleChangeDate} style={{ margin: '1rem 0' }} />
      </div>

      <div className={classes.listContainer}>
        <List ref={calendarRef} filter={filter} />
      </div>
    </div>
  )
}
