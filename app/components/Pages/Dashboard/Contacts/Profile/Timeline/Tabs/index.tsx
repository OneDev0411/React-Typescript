import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { getNotes } from 'models/contacts/helpers/get-notes'
import { PageTabs, Tab } from 'components/PageTabs'

export enum Filters {
  Events = 'events',
  Notes = 'notes'
}

interface Props {
  activeTab: Filters
  contact: INormalizedContact
  onChangeFilter(value: string): void
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex'
    },
    filters: {
      flex: 5
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
    </div>
  )
}
