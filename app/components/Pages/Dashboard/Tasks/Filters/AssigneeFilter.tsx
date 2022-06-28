import {
  Avatar,
  Box,
  makeStyles,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core'
import { AvatarGroup } from '@material-ui/lab'
import { mdiAccountArrowLeft } from '@mdi/js'

import { BaseDropdown } from '@app/views/components/BaseDropdown'

import { getAvatarTitle } from '../../Deals/utils/get-avatar-title'
import { AssigneesList } from '../components/AssigneesList'
import type { TasksListFilters } from '../context'

import { Button } from './components/Button'
import { ResetButton } from './components/ResetButton'

const useStyles = makeStyles(
  (theme: Theme) => ({
    list: {
      minWidth: '200px',
      maxHeight: '300px',
      overflow: 'scroll'
    },
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
  currentFilters: TasksListFilters
  updateFilters: (filters: Partial<TasksListFilters>) => void
}

export function AssigneeFilter({
  currentFilters: { assignees },
  updateFilters
}: Props) {
  const classes = useStyles()

  const getTitle = () => {
    if (!assignees?.length) {
      return 'Assignee'
    }

    if (assignees.length === 1) {
      return `Assigned to ${assignees[0].display_name}`
    }

    return (
      <AvatarGroup
        max={4}
        spacing={5}
        classes={{
          avatar: classes.avatar
        }}
      >
        {assignees.map(assignee => (
          <Tooltip key={assignee.id} title={assignee.display_name}>
            <Avatar
              className={classes.avatar}
              src={assignee.profile_image_url ?? ''}
            >
              {getAvatarTitle(assignee.display_name)}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    )
  }

  return (
    <BaseDropdown
      renderDropdownButton={({ onClick, ref }) => (
        <Button
          title={getTitle()}
          startIconPath={mdiAccountArrowLeft}
          isActive={!!assignees?.length}
          innerRef={ref}
          onClick={onClick}
        />
      )}
      renderMenu={({ close }) => (
        <div>
          <Box p={2}>
            <Typography variant="subtitle1">Task Assignees</Typography>
          </Box>

          <div className={classes.list}>
            <AssigneesList
              defaultAssignees={assignees ?? []}
              onChange={assignees =>
                setTimeout(() => updateFilters({ assignees }), 0)
              }
            />
          </div>

          {!!assignees?.length && (
            <ResetButton
              variant="text"
              onClick={() => {
                close()
                updateFilters({
                  assignees: undefined
                })
              }}
            />
          )}
        </div>
      )}
    />
  )
}
