import { ChangeEvent, useState } from 'react'

import {
  Box,
  Checkbox,
  CircularProgress,
  makeStyles,
  MenuItem
} from '@material-ui/core'

import { useUnsafeActiveTeam } from '@app/hooks/team'

import { useTaskMembers } from '../../../../queries/use-task-members'
import { useTaskMutation } from '../../../../queries/use-task-mutation'
import type { ITask } from '../../../../types'

const useStyles = makeStyles(
  () => ({
    root: {
      maxHeight: '200px',
      overflow: 'auto'
    }
  }),
  {
    name: 'Tasks-InlineAssigneeCell'
  }
)

interface Props {
  task: ITask
  closeHandler: () => void
}

export function InlineAssigneeCell({ task, closeHandler }: Props) {
  const mutation = useTaskMutation(task)

  const classes = useStyles()
  const [assignees, setAssignees] = useState(task.assignees ?? [])

  const activeTeam = useUnsafeActiveTeam()
  const { data: members, isLoading } = useTaskMembers(activeTeam?.brand.id)

  const onChange = (user: IUser, checked: boolean) => {
    const nextAssignees = checked
      ? [...assignees, user]
      : assignees.filter(assignee => assignee.id !== user.id)

    setAssignees(nextAssignees)

    mutation.mutate({
      assignees: nextAssignees
    })
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        minHeight="inherit"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress size={25} />
      </Box>
    )
  }

  return (
    <div className={classes.root}>
      {members?.map(member => (
        <MenuItem key={member.id} button dense>
          <Box display="flex" alignItems="center">
            <Checkbox
              size="small"
              color="primary"
              checked={assignees.some(assignee => assignee.id === member.id)}
              onChange={(_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
                onChange(member, checked)
              }
            />
            {member.display_name}
          </Box>
        </MenuItem>
      ))}
    </div>
  )
}
