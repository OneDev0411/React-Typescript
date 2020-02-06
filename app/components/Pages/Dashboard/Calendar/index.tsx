import React from 'react'

import GlobalHeader from 'components/GlobalHeader'

import { Tabs } from './components/Tabs'
import { DatePicker } from './components/DatePicker'

import { useStyles } from './use-styles'

export default function CalendarPage() {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <GlobalHeader title="Calendar" />

      <Tabs />
      <DatePicker />
    </div>
  )
}
