import React from 'react'
import { WithRouterProps } from 'react-router'

import GlobalHeader from 'components/GlobalHeader'

import { GridCalendar } from 'components/GridCalendar'

import { useStyles as useCommonStyles } from './use-styles'

export default function CalendarPage(props: WithRouterProps) {
  const classes = useCommonStyles()

  return (
    <div className={classes.container}>
      <GlobalHeader title="Calendar" noPadding />
      <div className={classes.listContainer}>
        <GridCalendar />
      </div>
    </div>
  )
}
