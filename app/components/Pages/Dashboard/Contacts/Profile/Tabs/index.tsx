import { Chip, makeStyles } from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'

import { getNotes } from 'models/contacts/helpers/get-notes'

export enum Filters {
  Events = 'events',
  Notes = 'notes'
}

const useStyles = makeStyles(
  theme => ({
    root: {
      marginBottom: theme.spacing(2)
    },
    tab: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.text.primary,
      '&$selected, &$selected:hover': {
        backgroundColor: theme.palette.success.ultralight,
        color: theme.palette.primary.main,
        cursor: 'default'
      }
    },
    selected: {
      backgroundColor: theme.palette.success.ultralight,
      color: theme.palette.primary.main
    },
    chip: {
      marginLeft: theme.spacing(1),
      backgroundColor: theme.palette.grey[400],
      color: theme.palette.common.white
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
  const notes = getNotes(contact)

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
        value={Filters.Events}
        aria-label="Events"
      >
        Events
      </ToggleButton>

      <ToggleButton
        classes={{ root: classes.tab, selected: classes.selected }}
        value={Filters.Notes}
        aria-label="Notes"
      >
        Notes
        {notes.length > 0 && (
          <Chip className={classes.chip} size="small" label={notes.length} />
        )}
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
