import { makeStyles } from '@material-ui/core'
import { mdiCalendarCheckOutline, mdiClockOutline } from '@mdi/js'

import SocialPostTableFilterButton from './SocialPostTableFilterButton'
import { SocialPostFilter } from './types'

const useStyles = makeStyles(
  theme => ({
    root: { marginBottom: theme.spacing(4) },
    filter: { marginRight: theme.spacing(1) }
  }),
  { name: 'SocialPostTableFilter' }
)

interface SocialPostTableFilterProps {
  value: SocialPostFilter
  onChange: (value: SocialPostFilter) => void
}

function SocialPostTableFilter({
  value,
  onChange
}: SocialPostTableFilterProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <SocialPostTableFilterButton
        className={classes.filter}
        icon={mdiCalendarCheckOutline}
        isActive={value === 'posted'}
        onClick={() => onChange('posted')}
      >
        Posted
      </SocialPostTableFilterButton>
      <SocialPostTableFilterButton
        className={classes.filter}
        icon={mdiClockOutline}
        isActive={value === 'scheduled'}
        onClick={() => onChange('scheduled')}
      >
        Scheduled
      </SocialPostTableFilterButton>
    </div>
  )
}

export default SocialPostTableFilter
