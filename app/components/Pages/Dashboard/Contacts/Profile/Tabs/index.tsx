import React from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

import { PageTabs, Tab } from 'components/PageTabs'

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
      <PageTabs
        value={activeFilter}
        defaultValue={activeFilter}
        tabs={[
          <Tab
            key="events"
            value={Filters.Events}
            label="Events"
            className={classes.tab}
          />,
          <Tab
            key="notes"
            value={Filters.Notes}
            label={`Notes (${notes.length})`}
            className={classes.tab}
          />
        ]}
        onChange={onChangeFilter}
      />
    </Box>
  )
}
