import { useCallback, useMemo, useState } from 'react'

import { Grid, Box } from '@material-ui/core'
import { mdiChevronDown, mdiChevronRight } from '@mdi/js'
import cn from 'classnames'
import { Draggable, DraggableProvided } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'

import useNotificationBadgesContext from '@app/components/Pages/Dashboard/SideNav/notificationBadgesContext/useNotificationBadgesContext'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import {
  setSelectedTask,
  setExpandTask,
  updateDealNotifications
} from 'actions/deals'
import { useChecklistActionsContext } from 'deals/contexts/actions-context/hooks'
import { IAppState } from 'reducers'
import { selectDealEnvelopes } from 'reducers/deals/envelopes'
import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'

import ActionsButton from '../../../../components/ActionsButton'
import { EnvelopeStatus } from '../EnvelopeStatus'
import { TaskNotifications } from '../Notification'
import { TaskItems } from '../TaskItems'

import { Activity } from './Activity'
import { useStyles } from './styles'
import { TaskBadge } from './TaskBadge'
import { TaskSplitter } from './TaskSplitter'
import { useTaskActions } from './use-task-actions'
import { useTaskDetails } from './use-task-details'
import { useTaskSelect } from './use-task-select'

interface Props {
  index: number
  deal: IDeal
  task: IDealTask & { is_expanded?: boolean }
  isBackOffice: boolean
  isDragDisabled: boolean
}

export function TaskRow({
  index,
  deal,
  task,
  isDragDisabled,
  isBackOffice
}: Props) {
  const classes = useStyles()
  const queryParamSelectTaskId = useTaskSelect(task)

  const dispatch = useDispatch()
  const { reload: reloadNotificationBadges } = useNotificationBadgesContext()
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

  const actions: ActionButtonId[] = useTaskActions({
    task,
    envelope,
    file,
    isBackOffice
  })

  const handleSelectTask = useCallback(() => {
    dispatch(setSelectedTask(task))

    if (task.room.new_notifications > 0) {
      setTimeout(() => {
        dispatch(updateDealNotifications(deal, task.room))
        reloadNotificationBadges()
      }, 0)
    }
  }, [dispatch, task, deal, reloadNotificationBadges])

  const isTaskExpandable = useMemo(() => {
    let count = 0

    if (task.form) {
      count += 1
    }

    count += taskEnvelopes.length
    count += attachments?.length ?? 0

    return count > 0
  }, [task, taskEnvelopes.length, attachments?.length])

  const toggleTaskOpen = () => {
    if (!isTaskExpandable) {
      return
    }

    setIsTaskExpanded(state => !state)

    setTimeout(() => {
      dispatch(setExpandTask(task.id, !isTaskExpanded))
    }, 0)
  }

  useTaskDetails(deal, task, handleSelectTask)

  return (
    <Draggable
      key={task.id}
      draggableId={task.id}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided: DraggableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          style={{
            userSelect: 'none',
            ...provided.draggableProps.style
          }}
        >
          {task.task_type === 'Splitter' ? (
            <TaskSplitter task={task} />
          ) : (
            <Grid
              id={`task-${task.id}`}
              container
              className={classes.container}
            >
              <Grid
                container
                className={cn(classes.row, {
                  'selected-by-task-param': task.id === queryParamSelectTaskId
                })}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  onClick={toggleTaskOpen}
                >
                  <Box
                    mr={0.5}
                    style={{
                      visibility: isTaskExpandable ? 'visible' : 'hidden'
                    }}
                  >
                    <SvgIcon
                      path={isTaskExpanded ? mdiChevronDown : mdiChevronRight}
                      size={muiIconSizes.medium}
                      style={{
                        margin: '6px 0 0 -6px' // icon is not standard
                      }}
                    />
                  </Box>

                  <span
                    className={cn(classes.title, {
                      [classes.link]: isTaskExpandable
                    })}
                  >
                    {task.title}
                  </span>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.actions}
                >
                  {!isTaskExpanded && !isBulkMode && (
                    <Box
                      display="flex"
                      alignItems="center"
                      className="hide-on-hover"
                    >
                      <EnvelopeStatus
                        envelope={envelope}
                        deal={deal}
                        task={task}
                      />
                      <TaskBadge
                        deal={deal}
                        task={task}
                        isBackOffice={isBackOffice}
                      />
                      <TaskNotifications task={task} />
                    </Box>
                  )}

                  <Box display="flex" alignItems="center" ml={1}>
                    {!isBulkMode && (
                      <div className="visible-on-hover">
                        <Activity task={task} onClick={handleSelectTask} />
                      </div>
                    )}

                    <ActionsButton
                      type="task"
                      deal={deal}
                      task={task}
                      envelope={envelope}
                      file={file}
                      actions={actions}
                      className={cn({
                        'visible-on-hover': !isTaskExpanded && !isBulkMode
                      })}
                      onTaskActionActivate={() =>
                        !isTaskExpanded && toggleTaskOpen()
                      }
                    />
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

              <div className={classes.divider} />
            </Grid>
          )}
        </div>
      )}
    </Draggable>
  )
}
