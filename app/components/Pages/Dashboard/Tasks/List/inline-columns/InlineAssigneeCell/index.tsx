import { useState } from 'react'

import {
  Box,
  Checkbox,
  CircularProgress,
  makeStyles,
  MenuItem,
  Theme
} from '@material-ui/core'

import { useUnsafeActiveTeam } from '@app/hooks/team'

import { useTaskMembers } from '../../../queries/use-task-members'

const useStyles = makeStyles(
  (theme: Theme) => ({
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
  defaultAssignees: Nullable<IUser[]>
  closeHandler: () => void
}

export function InlineAssigneeCell({ defaultAssignees, closeHandler }: Props) {
  const [assignees /* setAssignees */] = useState(
    defaultAssignees?.map(assignee => assignee.id)
  )

  const classes = useStyles()
  const activeTeam = useUnsafeActiveTeam()
  const { data: members, isLoading } = useTaskMembers(activeTeam?.brand.id)

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
              checked={assignees?.includes(member.id)}
            />
            {member.display_name}
          </Box>
        </MenuItem>
      ))}
    </div>
  )
}
