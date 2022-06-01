import { makeStyles } from '@material-ui/core'
import {
  mdiCalendarCheckOutline,
  mdiClockOutline,
  mdiAlertOutline
} from '@mdi/js'

import SocialPostTableFilterButton from './SocialPostTableFilterButton'
import { SocialPostFilter } from './types'

const useStyles = makeStyles(
  theme => ({
    root: { marginBottom: theme.spacing(4) },
    filter: { marginRight: theme.spacing(1) }
  }),
  { name: 'SocialPostTableFilter' }
)

interface FilterItem {
  icon: string
  value: SocialPostFilter
  label: string
}

interface SocialPostTableFilterProps {
  value: SocialPostFilter
  onChange: (value: SocialPostFilter) => void
}

const filterItems: FilterItem[] = [
  {
    icon: mdiCalendarCheckOutline,
    value: 'posted',
    label: 'Posted'
  },
  {
    icon: mdiClockOutline,
    value: 'scheduled',
    label: 'Scheduled'
  },
  {
    icon: mdiAlertOutline,
    value: 'failed',
    label: 'Failed'
  }
]

function SocialPostTableFilter({
  value,
  onChange
}: SocialPostTableFilterProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {filterItems.map(item => (
        <SocialPostTableFilterButton
          key={item.value}
          className={classes.filter}
          icon={item.icon}
          isActive={value === item.value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </SocialPostTableFilterButton>
      ))}
    </div>
  )
}

export default SocialPostTableFilter
