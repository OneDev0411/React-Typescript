import { useState } from 'react'
import { Grid, Box, IconButton, Typography } from '@material-ui/core'
import { mdiFolderOutline, mdiFolderOpenOutline } from '@mdi/js'

import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import {
  setSelectedTask,
  setExpandTask,
  updateDealNotifications
} from 'actions/deals'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { IAppState } from 'reducers'

import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'

import { TaskItems } from '../TaskItems'
import { EnvelopeStatus } from '../EnvelopeStatus'
import { TaskNotifications } from '../Notification'
import { Activity } from './Activity'

import ActionsButton from '../../../../components/ActionsButton'

import { getTaskActions } from './get-task-actions'

import { TaskStatus } from './Status'

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

  const { attachments } = task.room
  const file = attachments ? attachments[0] : undefined

  const actions: ActionButtonId[] = getTaskActions({
    task,
    envelope,
    file,
    isBackOffice
  })

  const getRowsCount = () => {
    let count = 0

    if (task.form) {
      count++
    }

    count += (task.room.attachments || []).length
    count += (getTaskEnvelopes(taskEnvelopes, task) || []).length

    return count
  }

  const rowsCount = getRowsCount()

  const toggleTaskOpen = () => {
    if (rowsCount === 0) {
      return
    }

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
          <IconButton disabled={rowsCount === 0} onClick={toggleTaskOpen}>
            <SvgIcon
              path={isTaskExpanded ? mdiFolderOpenOutline : mdiFolderOutline}
            />
          </IconButton>{' '}
          <div>
            <Box display="flex" alignItems="center">
              <span
                className={cn(classes.title, classes.link)}
                onClick={toggleTaskOpen}
              >
                {task.title}
              </span>

              <TaskStatus deal={deal} task={task} isBackOffice={isBackOffice} />
            </Box>

            <Typography variant="caption" className={classes.caption}>
              <EnvelopeStatus envelope={envelope} deal={deal} task={task} />
            </Typography>
          </div>
        </Box>

        <Box display="flex" alignItems="center" className={classes.actions}>
          <Box display="flex" alignItems="center">
            <div className="visible-on-hover">
              <Activity task={task} onClick={handleSelectTask} />
            </div>

            <div
              className={cn({
                'visible-on-hover': !isTaskExpanded
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
