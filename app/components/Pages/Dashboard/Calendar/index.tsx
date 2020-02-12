import React, { useRef } from 'react'

import GlobalHeader from 'components/GlobalHeader'

import List from 'components/Calendar'
import { CalendarRef } from 'components/Calendar/types'

import { Tabs } from './components/Tabs'

import { DatePicker } from './components/DatePicker'

import { useStyles as useCommonStyles } from './use-styles'

export default function CalendarPage() {
  const classes = useCommonStyles()
  const calendarRef = useRef<CalendarRef>(null)

  const handleChangeDate = (date: Date) => {
    calendarRef.current && calendarRef.current.jumpToDate(date)
  }

  return (
    <div className={classes.container}>
      <div className={classes.topSide}>
        <GlobalHeader title="Calendar" />
        <Tabs />
        <DatePicker onChange={handleChangeDate} style={{ margin: '1rem 0' }} />
      </div>

      <div className={classes.listContainer}>
        <List
          ref={calendarRef}
          // filter={}
          // onChangeActiveDate={debounce(setActiveDate, 100)}
          // onLoadEvents={handleOnLoadEvents}
        />
      </div>
    </div>
  )
}
