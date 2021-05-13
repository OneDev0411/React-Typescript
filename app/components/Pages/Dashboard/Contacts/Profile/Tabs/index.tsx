import React from 'react'
import { Box, Tab, Tabs as MUITabs, makeStyles, Theme } from '@material-ui/core'

import { getNotes } from 'models/contacts/helpers/get-notes'

export enum Filters {
  Events = 'events',
  Notes = 'notes'
}

interface Props {
  activeFilter: Filters
  contact: INormalizedContact
  onChangeFilter(value: string): void
}

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    tab: theme.typography.body1
  }),
  { name: 'ContactProfileTabs' }
)

export const Tabs = ({ contact, activeFilter, onChangeFilter }: Props) => {
  const classes = useStyles()
  const notes = getNotes(contact)

  return (
    <Box className={classes.container}>
      <MUITabs
        value={activeFilter}
        onChange={(e, value) => onChangeFilter(value)}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value={Filters.Events} label="Events" className={classes.tab} />
        <Tab
          value={Filters.Notes}
          label={`Notes (${notes.length})`}
          className={classes.tab}
        />
      </MUITabs>
    </Box>
  )
}
