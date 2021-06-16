import { Grid, Box, Typography } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'

import { isChecklistExpanded } from 'reducers/deals/checklists'
import { setExpandChecklist } from 'actions/deals'

import { IAppState } from 'reducers'

import { ChecklistLabels } from './Labels'
import { FolderOptionsMenu } from './Menu'
import { TaskRow } from './TaskRow'
import NewTaskRow from './NewTaskRow'

import { useStyles } from './styles'

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

  return (
    <Grid container className={classes.container}>
      <Grid container className={classes.header}>
        <Grid
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

      {isExpanded && (
        <Grid container>
          {tasks.map((task, index) => (
            <TaskRow
              index={index}
              key={task.id}
              task={task}
              deal={deal}
              isBackOffice={isBackOffice}
            />
          ))}

          {createNewTask && <NewTaskRow deal={deal} checklist={checklist} />}
        </Grid>
      )}
    </Grid>
  )
}
