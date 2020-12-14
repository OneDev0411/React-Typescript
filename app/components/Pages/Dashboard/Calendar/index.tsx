import React, { useRef } from 'react'
import { WithRouterProps } from 'react-router'
import { useEffectOnce } from 'react-use'

import GlobalHeader from 'components/GlobalHeader'

import { GridCalendar } from 'components/GridCalendar'
import { ViewAs } from 'components/ViewAs'
import { ActionRef } from 'components/GridCalendar/types'
import { SET_CREATE_CALLBACK_HANDLER } from 'components/GlobalActionsButton/context/constants'
import { useGlobalActionContext } from 'components/GlobalActionsButton/hooks/use-global-action-context'

import { useStyles as useCommonStyles } from './use-styles'

export default function CalendarPage(props: WithRouterProps) {
  const classes = useCommonStyles()
  const actionRef = useRef<ActionRef>(null)
  const [, dispatch] = useGlobalActionContext()
  const handleCreateTask = (
    event: IEvent | ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    actionRef.current!.updateCrmEvents(event, 'created')
  }

  useEffectOnce(() => {
    dispatch({
      type: SET_CREATE_CALLBACK_HANDLER,
      handlers: {
        onCreateOpenHouse: handleCreateTask,
        onCreateEvent: handleCreateTask,
        onCreateEmailFollowUp: handleCreateTask,
        onCreateTour: handleCreateTask
      }
    })
  })

  return (
    <div className={classes.container}>
      <GlobalHeader title="Calendar" noPadding>
        <ViewAs />
      </GlobalHeader>
      <div className={classes.listContainer}>
        <GridCalendar actionRef={actionRef} />
      </div>
    </div>
  )
}
