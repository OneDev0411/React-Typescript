import React from 'react'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'
import SavedSegments from 'components/Grid/SavedSegments/List'

import { SortFields } from '../SortFields'
import ContactFilters from '../Filters'

interface Props {
  filter: {
    show: boolean
    handler: () => void
  }
  savedListProps: {
    name: string
    associations: string
    getPredefinedLists: () => void
    onChange: (segment) => void
  }
  sortProps: {
    onChange: (item) => void
  }
  users: any
}

export const ContactsTabs = ({
  filter,
  savedListProps,
  sortProps,
  users
}: Props) => {
  return (
    <>
      <PageTabs
        tabs={[
          <Tab key={0} label="All" value={0} />,
          <TabLink key={1} label="Drafts" value={1} to="link" />,
          <Tab key="saved" label={<SavedSegments {...savedListProps} />} />,
          <Tab key="sort" label={<SortFields {...sortProps} />} />
        ]}
      />
      {filter.show && (
        <ContactFilters onFilterChange={filter.handler} users={users} />
      )}
    </>
  )
}

export default ContactsTabs
