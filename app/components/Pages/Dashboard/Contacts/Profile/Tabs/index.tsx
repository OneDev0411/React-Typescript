import React from 'react'
import { makeStyles, Theme } from '@material-ui/core'

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
      marginBottom: 0
    }
  }),
  { name: 'ContactProfileTabs' }
)

export const Tabs = ({ contact, activeFilter, onChangeFilter }: Props) => {
  const classes = useStyles()
  const notes = getNotes(contact)

  return (
    <PageTabs
      value={activeFilter}
      defaultValue={activeFilter}
      containerCustomClass={classes.container}
      tabs={[
        <Tab key="events" value={Filters.Events} label="Events" />,
        <Tab
          key="notes"
          value={Filters.Notes}
          label={`Notes (${notes.length})`}
        />
      ]}
      onChange={onChangeFilter}
    />
  )
}
