import React, { useRef } from 'react'
import { WithRouterProps } from 'react-router'

import GlobalHeader from 'components/GlobalHeader'

import { GridCalendar } from 'components/GridCalendar'
import { ViewAs } from 'components/ViewAs'
import { ActionRef } from 'components/GridCalendar/types'

import { useStyles as useCommonStyles } from './use-styles'

export default function CalendarPage(props: WithRouterProps) {
  const classes = useCommonStyles()
  const actionRef = useRef<ActionRef>(null)

  const handleCreateTask = (
    event: IEvent | ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    actionRef.current!.updateCrmEvents(event, 'created')
  }

  return (
    <div className={classes.container}>
      <GlobalHeader
        title="Calendar"
        onCreateEvent={handleCreateTask}
        onCreateOpenHouse={handleCreateTask}
        onCreateTour={handleCreateTask}
        noPadding
      >
        <ViewAs />
      </GlobalHeader>
      <div className={classes.listContainer}>
        <GridCalendar actionRef={actionRef} />
      </div>
    </div>
  )
}
