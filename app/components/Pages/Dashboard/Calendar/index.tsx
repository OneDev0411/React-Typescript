import { useRef, useState } from 'react'

import { mdiCalendarPlus } from '@mdi/js'
import { useEffectOnce, useTitle } from 'react-use'

import { useUser } from '@app/hooks/use-user'
import AddAccountButton from '@app/views/components/AddAccountButton'
import { SET_CREATE_CALLBACK_HANDLER } from '@app/views/components/GlobalActionsButton/context/constants'
import { useGlobalActionContext } from '@app/views/components/GlobalActionsButton/hooks/use-global-action-context'
import GlobalHeader from '@app/views/components/GlobalHeader'
import { GridCalendar } from '@app/views/components/GridCalendar'
import { ActionRef } from '@app/views/components/GridCalendar/types'
import { ViewAs } from '@app/views/components/ViewAs'
import { EventDrawer } from 'components/EventDrawer'
import { DONE_STATUS } from 'components/EventDrawer/components/FutureEventDoneConfirmation'
import { initialValueGenerator } from 'components/EventDrawer/helpers/initial-value-generator'

import { useStyles as useCommonStyles } from './use-styles'

export default function CalendarPage() {
  useTitle('Calendar | Rechat')

  const classes = useCommonStyles()
  const actionRef = useRef<ActionRef>(null)
  const user = useUser()
  const [isOpenEventDrawer, setIsOpenEventDrawer] = useState(false)
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
        </div>
        <AddAccountButton
          createMenuItemProps={{
            title: 'Log Activity',
            iconPath: mdiCalendarPlus,
            onClick: () => {
              setIsOpenEventDrawer(true)
            }
          }}
        />
        {isOpenEventDrawer && (
          <EventDrawer
            isOpen
            user={user}
            title="Log Activity"
            submitCallback={(event: IEvent) => {
              handleCreateTask(event)
              setIsOpenEventDrawer(false)
            }}
            onClose={() => {
              setIsOpenEventDrawer(false)
            }}
            initialValues={{
              ...initialValueGenerator(user, [], new Date()),
              status: DONE_STATUS
            }}
          />
        )}
      </GlobalHeader>
      <div className={classes.listContainer}>
        <GridCalendar actionRef={actionRef} />
      </div>
    </div>
  )
}
