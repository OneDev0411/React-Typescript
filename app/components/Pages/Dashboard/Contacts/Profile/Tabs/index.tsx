import React from 'react'

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

export const Tabs = ({ contact, activeFilter, onChangeFilter }: Props) => {
  const notes = getNotes(contact)

  return (
    <PageTabs
      value={activeFilter}
      defaultValue={activeFilter}
      containerStyle={{
        marginBottom: 0
      }}
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
