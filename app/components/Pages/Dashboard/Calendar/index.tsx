import React, { useRef } from 'react'
import { WithRouterProps } from 'react-router'

import GlobalHeader from 'components/GlobalHeader'

import { GridCalendar } from 'components/GridCalendar'
import { ActionRef } from 'components/GridCalendar/types'

import { useStyles as useCommonStyles } from './use-styles'

export default function CalendarPage(props: WithRouterProps) {
  const classes = useCommonStyles()
  const actionRef = useRef<ActionRef>(null)

  const handleCreateEvent = (event: IEvent) => {
    actionRef.current!.updateCrmEvents(event, 'created')
  }

  return (
    <div className={classes.container}>
      <GlobalHeader
        title="Calendar"
        onCreateEvent={handleCreateEvent}
        noPadding
      />
      <div className={classes.listContainer}>
        <GridCalendar actionRef={actionRef} />
      </div>
    </div>
  )
}
