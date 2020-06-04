import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { getNotes } from 'models/contacts/helpers/get-notes'
import { PageTabs, Tab } from 'components/PageTabs'

import AddEvent from '../AddEvent'
import AddNote from '../AddNote'

export enum Filters {
  Events = 'events',
  Notes = 'notes'
}

interface Props {
  activeTab: Filters
  contact: IContact
  onCreateNote(contact: IContact): void
  onChangeFilter(value: string): void
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex'
    },
    filters: {
      flex: 5
    },
    actions: {
      flex: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      borderBottom: `1px solid ${theme.palette.divider}`,
      marginBottom: theme.spacing(1),
      '& button': {
        marginLeft: theme.spacing(1)
      }
    }
  })
)

export function TabsFilter(props: Props) {
  const classes = useStyles()
  const notes = getNotes(props.contact)

  return (
    <div className={classes.container}>
      <div className={classes.filters}>
        <PageTabs
          value={props.activeTab}
          defaultValue={Filters.Events}
          onChange={props.onChangeFilter}
          tabs={[
            <Tab key={0} value={Filters.Events} label="Interactions" />,
            <Tab
              key={1}
              value={Filters.Notes}
              label={`Notes (${notes.length})`}
            />
          ]}
        />
      </div>

      <div className={classes.actions}>
        <AddNote
          contactId={props.contact.id}
          onCreateNote={props.onCreateNote}
        />
        <AddEvent contact={props.contact} />
      </div>
    </div>
  )
}
