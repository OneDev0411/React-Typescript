import { ChangeEvent, useState } from 'react'

import {
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  makeStyles,
  MenuItem,
  Theme
} from '@material-ui/core'
import { sortBy } from 'lodash'
import { useSelector } from 'react-redux'

import { useUnsafeActiveTeam } from '@app/hooks/team'
import { selectUserUnsafe } from '@app/selectors/user'

import { getAvatarTitle } from '../../Deals/utils/get-avatar-title'
import { useTaskMembers } from '../queries/use-task-members'

const useStyles = makeStyles(
  (theme: Theme) => ({
    avatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      fontSize: theme.typography.caption.fontSize
    }
  }),
  {
    name: 'Tasks-AssigneeFilter'
  }
)

interface Props {
  defaultAssignees: IUser[]
  onChange: (nextAssignees: IUser[]) => void
}

export function AssigneesList({ defaultAssignees, onChange }: Props) {
  const classes = useStyles()
  const activeTeam = useUnsafeActiveTeam()
  const user = useSelector(selectUserUnsafe)
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

  if (!members?.length) {
    return null
  }

  return (
    <>
      {sortBy(members, member => (member.id === user?.id ? 0 : 1)).map(
        member => {
          const isChecked = assignees.some(
            assignee => assignee.id === member.id
          )

          return (
            <MenuItem
              key={member.id}
              button
              dense
              onClick={() => handleChange(member, !isChecked)}
            >
              <Box display="flex" alignItems="center">
                <Checkbox
                  size="small"
                  color="primary"
                  checked={isChecked}
                  onChange={(
                    _: ChangeEvent<HTMLInputElement>,
                    checked: boolean
                  ) => handleChange(member, checked)}
                />
                <Box mr={1}>
                  <Avatar
                    className={classes.avatar}
                    src={member.profile_image_url ?? ''}
                  >
                    {getAvatarTitle(member.display_name)}
                  </Avatar>
                </Box>
                {member.display_name} {member.id === user?.id && <>(Myself)</>}
              </Box>
            </MenuItem>
          )
        }
      )}
    </>
  )
}
