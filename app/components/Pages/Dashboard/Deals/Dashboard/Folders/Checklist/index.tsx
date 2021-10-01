import { Grid, Box, Typography } from '@material-ui/core'
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult
} from 'react-beautiful-dnd'
import { useSelector, useDispatch } from 'react-redux'

import { updateChecklistTasksOrders } from '@app/models/Deal/task'
import { reorder } from '@app/utils/dnd-reorder'
import { setExpandChecklist, updateTasksOrders } from 'actions/deals'
import { IAppState } from 'reducers'
import { isChecklistExpanded } from 'reducers/deals/checklists'

import { ChecklistLabels } from './Labels'
import { FolderOptionsMenu } from './Menu'
import NewTaskRow from './NewTaskRow'
import { useStyles } from './styles'
import { TaskRow } from './TaskRow'

interface Props {
  deal: IDeal
  tasks: IDealTask[]
  title: string
  checklist: IDealChecklist | null
  isBackOffice: boolean
  isFolderExpanded?: boolean
  createNewTask?: boolean
  onToggleExpand?(): void
}

export function ChecklistFolder({
  deal,
  tasks,
  title,
  checklist,
  isBackOffice,
  isFolderExpanded = false,
  createNewTask = true,
  onToggleExpand
}: Props) {
  const classes = useStyles()

  const dispatch = useDispatch()
  const isExpanded = useSelector<IAppState, boolean>(({ deals }) => {
    return checklist
      ? isChecklistExpanded(deals.checklists, checklist.id)
      : isFolderExpanded || false
  })

  const toggleFolderOpen = () => {
    if (checklist) {
      dispatch(setExpandChecklist(checklist.id, !isExpanded))
    }

    onToggleExpand?.()
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return false
    }

    const reorderedTasks = reorder(
      tasks,
      result.source.index,
      result.destination.index
    ).map((task, index) => ({
      id: task.id,
      order: index + 1
    }))

    dispatch(updateTasksOrders(reorderedTasks))
    updateChecklistTasksOrders(deal.id, checklist!.id, reorderedTasks)
  }

  return (
    <Grid container className={classes.container}>
      <Grid container className={classes.header}>
        <Grid
          container
          item
          xs={10}
          spacing={1}
          className={classes.titleContainer}
          onClick={toggleFolderOpen}
        >
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <Typography variant="subtitle1">{title}</Typography>
            </Box>
            <ChecklistLabels checklist={checklist} />
          </Box>
        </Grid>

        <Grid item xs={2}>
          <Box textAlign="right">
            <FolderOptionsMenu
              deal={deal}
              checklist={checklist}
              isBackOffice={isBackOffice}
            />
          </Box>
        </Grid>
      </Grid>

      <DragDropContext onDragEnd={handleDragEnd}>
        {isExpanded && (
          <Box width="100%">
            <Droppable
              droppableId={checklist ? checklist.id : 'disabled'}
              isDropDisabled={!checklist}
            >
              {(provided: DroppableProvided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks.map((task, index) => (
                    <TaskRow
                      index={index}
                      key={task.id}
                      task={task}
                      deal={deal}
                      isDragDisabled={!checklist}
                      isBackOffice={isBackOffice}
                    />
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {createNewTask && <NewTaskRow deal={deal} checklist={checklist} />}
          </Box>
        )}
      </DragDropContext>
    </Grid>
  )
}
