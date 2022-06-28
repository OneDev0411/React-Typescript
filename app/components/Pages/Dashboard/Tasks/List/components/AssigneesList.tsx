import { ChangeEvent, useState } from 'react'

import { Box, Checkbox, CircularProgress, MenuItem } from '@material-ui/core'

import { useUnsafeActiveTeam } from '@app/hooks/team'

import { useTaskMembers } from '../../queries/use-task-members'

interface Props {
  defaultAssignees: IUser[]
  onChange: (nextAssignees: IUser[]) => void
}

export function AssigneesList({ defaultAssignees, onChange }: Props) {
  const activeTeam = useUnsafeActiveTeam()
  const { data: members, isLoading } = useTaskMembers(activeTeam?.brand.id)
  const [assignees, setAssignees] = useState(defaultAssignees ?? [])

  const handleChange = (user: IUser, checked: boolean) => {
    const nextAssignees = checked
      ? [...assignees, user]
      : assignees.filter(assignee => assignee.id !== user.id)

    setAssignees(nextAssignees)

    onChange(nextAssignees)
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        minHeight="inherit"
        alignItems="center"
        justifyContent="center"
        my={2}
      >
        <CircularProgress size={25} />
      </Box>
    )
  }

  return (
    <>
      {members?.map(member => (
        <MenuItem key={member.id} button dense>
          <Box display="flex" alignItems="center">
            <Checkbox
              size="small"
              color="primary"
              checked={assignees.some(assignee => assignee.id === member.id)}
              onChange={(_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
                handleChange(member, checked)
              }
            />
            {member.display_name}
          </Box>
        </MenuItem>
      ))}
    </>
  )
}
