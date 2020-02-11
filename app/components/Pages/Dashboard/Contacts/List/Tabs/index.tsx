import React from 'react'

import { PageTabs, Tab, TabLink } from 'components/PageTabs'

import ContactFilters from '../Filters'
import TagsList from '../TagsList'

interface Props {
  showContactFilters: boolean
  tagActiveStatus: boolean
  contactFiltersHandler: () => void
  tagFilterHandler: ({ filters: any }) => void
  users: any
}

export const ContactsTabs = ({
  showContactFilters,
  contactFiltersHandler,
  tagActiveStatus,
  tagFilterHandler,
  users
}: Props) => {
  // const currentUrl = window.location.pathname

  return (
    <>
      {showContactFilters && (
        <ContactFilters onFilterChange={contactFiltersHandler} users={users} />
      )}
      <PageTabs
        tabs={[
          <Tab
            key={2}
            value={2}
            label={
              <TagsList
                onFilterChange={tagFilterHandler}
                isActive={tagActiveStatus}
              />
            }
          />,
          <Tab key={0} label="All" value={0} />,
          <TabLink key={1} label="Drafts" value={1} to="link" />
        ]}
      />
    </>
  )
}

export default ContactsTabs
