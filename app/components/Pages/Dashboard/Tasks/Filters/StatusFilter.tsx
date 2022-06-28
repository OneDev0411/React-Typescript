import {
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Theme
} from '@material-ui/core'
import { mdiListStatus } from '@mdi/js'

import FilterButton from '@app/views/components/Filters/FilterButton'
import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { Button } from './components/Button'

const Options = [
  { label: 'Completed', value: 'DONE' },
  { label: 'Unfinished', value: 'PENDING' }
]

const useStyles = makeStyles(
  (theme: Theme) => ({
    listItemIcon: {
      minWidth: theme.spacing(3)
    }
  }),
  {
    name: 'Tasks-Filters-Status'
  }
)
export function StatusFilter() {
  const classes = useStyles()

  return (
    <FilterButton
      renderButton={({ onClick }) => (
        <Button
          title="Status"
          startIconPath={mdiListStatus}
          isActive={false}
          onClick={onClick}
        />
      )}
      renderDropdown={() => (
        <div>
          {Options.map(option => (
            <MenuItem key={option.value}>
              <ListItemIcon className={classes.listItemIcon}>
                <SvgIcon path={mdiListStatus} size={muiIconSizes.small} />
              </ListItemIcon>

              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}
