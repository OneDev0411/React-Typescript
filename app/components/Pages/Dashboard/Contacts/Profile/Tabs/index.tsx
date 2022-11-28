import { makeStyles } from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'

export enum Filters {
  History = 'history',
  Upcoming = 'upcoming',
  Notes = 'notes'
}

const useStyles = makeStyles(
  theme => ({
    root: {
      border: 'none',
      fontSize: theme.typography.body1.fontSize
    },
    tab: {
      boxSizing: 'border-box',
      border: 'none',
      borderRadius: 0,
      padding: theme.spacing(2, 2),
      backgroundColor: 'transparent',
      fontWeight: 400,
      color: theme.palette.grey[600],
      borderBottom: '2px solid transparent',
      '&$selected, &$selected:hover': {
        fontWeight: 600,
        color: theme.palette.grey[900],
        backgroundColor: 'transparent',
        borderBottomColor: theme.palette.primary.main,
        cursor: 'default'
      }
    },
    selected: {
      backgroundColor: 'transparent',
      color: theme.palette.primary.main
    }
  }),
  { name: 'ContactProfileTabs' }
)

interface Props {
  activeFilter: Filters
  contact: INormalizedContact
  onChangeFilter(value: string): void
}

export const Tabs = ({ contact, activeFilter, onChangeFilter }: Props) => {
  const classes = useStyles()

  const handleChange = (_, value) => {
    if (value !== null) {
      onChangeFilter(value)
    }
  }

  return (
    <ToggleButtonGroup
      className={classes.root}
      value={activeFilter}
      onChange={handleChange}
      aria-label="Contact tabs"
      exclusive
    >
      <ToggleButton
        classes={{ root: classes.tab, selected: classes.selected }}
        value={Filters.History}
        aria-label="History"
      >
        History
      </ToggleButton>

      <ToggleButton
        classes={{ root: classes.tab, selected: classes.selected }}
        value={Filters.Upcoming}
        aria-label="Upcoming"
      >
        Upcoming
      </ToggleButton>

      <ToggleButton
        classes={{ root: classes.tab, selected: classes.selected }}
        value={Filters.Notes}
        aria-label="Notes"
      >
        Notes
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
