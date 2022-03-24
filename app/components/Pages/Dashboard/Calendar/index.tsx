import { useRef } from 'react'

import { useEffectOnce, useTitle } from 'react-use'

import { SET_CREATE_CALLBACK_HANDLER } from 'components/GlobalActionsButton/context/constants'
import { useGlobalActionContext } from 'components/GlobalActionsButton/hooks/use-global-action-context'
import GlobalHeader from 'components/GlobalHeader'
import { GridCalendar } from 'components/GridCalendar'
import { ActionRef } from 'components/GridCalendar/types'
import ImportContactsButton from 'components/ImportContactsButton'
import { ViewAs } from 'components/ViewAs'

import { useStyles as useCommonStyles } from './use-styles'

export default function CalendarPage() {
  useTitle('Calendar | Rechat')

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
        <div className={classes.viewAsContainer}>
          <ViewAs />
          <ImportContactsButton />
        </div>
      </GlobalHeader>
      <div className={classes.listContainer}>
        <GridCalendar actionRef={actionRef} />
      </div>
    </div>
  )
}
