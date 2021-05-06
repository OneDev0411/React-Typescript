import { useState } from 'react'
import { Grid, Box, Typography } from '@material-ui/core'

import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import {
  setSelectedTask,
  setExpandTask,
  updateDealNotifications
} from 'actions/deals'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { IAppState } from 'reducers'

import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'

import { useChecklistActionsContext } from 'deals/contexts/actions-context/hooks'

import { TaskItems } from '../TaskItems'
import { EnvelopeStatus } from '../EnvelopeStatus'
import { TaskNotifications } from '../Notification'
import { Activity } from './Activity'

import ActionsButton from '../../../../components/ActionsButton'

import { getTaskActions } from './get-task-actions'

import { TaskIcon } from './TaskIcon'

import { useStyles } from './styles'

interface Props {
  index: number
  deal: IDeal
  task: IDealTask & { is_expanded?: boolean }
  isBackOffice: boolean
}

export function TaskRow({ index, deal, task, isBackOffice }: Props) {
  const classes = useStyles({
    index
  })

  const dispatch = useDispatch()
  const [checklistBulkActionsContext] = useChecklistActionsContext()

  const [isTaskExpanded, setIsTaskExpanded] = useState(
    task.is_expanded === true
  )

  const dealEnvelopes = useSelector<IAppState, IDealEnvelope[]>(({ deals }) =>
    selectDealEnvelopes(deal, deals.envelopes)
  )

  const taskEnvelopes = getTaskEnvelopes(dealEnvelopes, task)
  const envelope = taskEnvelopes.filter(
    envelope => !['Voided', 'Declined'].includes(envelope.status)
  )[0]

  const isBulkMode = checklistBulkActionsContext.actions.length > 0
  const { attachments } = task.room
  const file = attachments ? attachments[0] : undefined

  const actions: ActionButtonId[] = getTaskActions({
    task,
    envelope,
    file,
    isBackOffice
  })

  const toggleTaskOpen = () => {
    dispatch(setExpandTask(task.id, !isTaskExpanded))
    setIsTaskExpanded(state => !state)
  }

  const handleSelectTask = () => {
    if (task.room.new_notifications > 0) {
      dispatch(updateDealNotifications(deal, task.room))
    }

    dispatch(setSelectedTask(task))
  }

  return (
    <Grid container className={classes.container}>
      <Grid container className={classes.row}>
        <Box display="flex" alignItems="center">
          <TaskIcon
            deal={deal}
            task={task}
            isTaskExpanded={isTaskExpanded}
            isBackOffice={isBackOffice}
            onClick={toggleTaskOpen}
          />

          <div>
            <Box display="flex" alignItems="center">
              <span
                className={cn(classes.title, classes.link)}
                onClick={toggleTaskOpen}
              >
                {task.title}
              </span>
            </Box>

            <Typography variant="caption" className={classes.caption}>
              <EnvelopeStatus envelope={envelope} deal={deal} task={task} />
            </Typography>
          </div>
        </Box>

        <Box display="flex" alignItems="center" className={classes.actions}>
          <Box display="flex" alignItems="center">
            {!isBulkMode && (
              <div className="visible-on-hover">
                <Activity task={task} onClick={handleSelectTask} />
              </div>
            )}

            <div
              className={cn({
                'visible-on-hover': !isTaskExpanded && !isBulkMode
              })}
            >
              <ActionsButton
                deal={deal}
                task={task}
                envelope={envelope}
                file={file}
                actions={actions}
              />
            </div>
          </Box>

          <Box className="hide-on-hover">
            <TaskNotifications task={task} />
          </Box>
        </Box>
      </Grid>

      <Grid container>
        <TaskItems
          isOpen={isTaskExpanded}
          task={task}
          deal={deal}
          isBackOffice={isBackOffice}
        />
      </Grid>

      {isTaskExpanded && <div className={classes.verticalGuideLine} />}
    </Grid>
  )
}
