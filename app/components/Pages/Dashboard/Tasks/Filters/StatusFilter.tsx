import {
  Box,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Theme,
  Typography
} from '@material-ui/core'
import { mdiCheck, mdiClose, mdiListStatus } from '@mdi/js'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import type { TasksListFilters } from '../context'

import { Button } from './components/Button'
import { ResetButton } from './components/ResetButton'

const Options = [
  { label: 'Completed', value: 'DONE', icon: mdiCheck },
  { label: 'Unfinished', value: 'PENDING', icon: mdiClose }
]

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      minWidth: '200px'
    },
    listItemIcon: {
      minWidth: theme.spacing(3)
    }
  }),
  {
    name: 'Tasks-Filters-Status'
  }
)

interface Props {
  currentFilters: TasksListFilters
  updateFilters: (filters: Partial<TasksListFilters>) => void
}

export function StatusFilter({
  currentFilters: { status },
  updateFilters
}: Props) {
  const classes = useStyles()

  return (
    <BaseDropdown
      renderDropdownButton={({ onClick, ref }) => (
        <Button
          title={
            status
              ? Options.find(({ value }) => value === status)!.label
              : 'Status'
          }
          startIconPath={mdiListStatus}
          isActive={!!status}
          innerRef={ref}
          onClick={onClick}
        />
      )}
      renderMenu={({ close }) => (
        <div className={classes.root}>
          <Box p={2}>
            <Typography variant="subtitle1">Task Status</Typography>
          </Box>

          {Options.map(option => (
            <MenuItem
              key={option.value}
              selected={option.value === status}
              onClick={() => {
                close()

                setTimeout(
                  () =>
                    updateFilters({
                      status: option.value
                    }),
                  0
                )
              }}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <SvgIcon path={option.icon} size={muiIconSizes.small} />
              </ListItemIcon>

              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}

          {status && (
            <ResetButton
              variant="text"
              onClick={() =>
                updateFilters({
                  status: undefined
                })
              }
            />
          )}
        </div>
      )}
    />
  )
}
