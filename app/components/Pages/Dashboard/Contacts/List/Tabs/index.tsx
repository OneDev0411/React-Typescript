import React from 'react'
import { useDispatch } from 'react-redux'
import { Box } from '@material-ui/core'

import { PageTabs, Tab, TabSpacer } from 'components/PageTabs'
import SavedSegments from 'components/Grid/SavedSegments/List'
import Badge from 'components/Badge'
import { resetActiveFilters } from 'actions/filter-segments/active-filters'
import { changeActiveFilterSegment } from 'actions/filter-segments/change-active-segment'

import { CONTACTS_SEGMENT_NAME } from '../../constants'
import { SYNCED_CONTACTS_LIST_ID } from '../constants'

import { SortFields } from '../SortFields'
import ContactFilters from '../Filters'

interface Props {
  handleFilterChange: (newFilters: object, resetLoadedRanges: boolean) => void
  handleChangeSavedSegment: (savedSegment: object) => void
  filter: {
    show: boolean
  }
  savedListProps: {
    name: string
    associations: string
    getPredefinedLists: () => void
    onChange: (segment) => void
  }
  sortProps: {
    onChange: (item) => void
    currentOrder: string
  }
  contactCount: number
  activeSegment: any
  users: any
}

export const ContactsTabs = ({
  handleFilterChange,
  handleChangeSavedSegment,
  filter,
  savedListProps,
  sortProps,
  contactCount,
  activeSegment,
  users
}: Props) => {
  const dispatch = useDispatch()

  const clickHandler = async (type: string) => {
    await dispatch(resetActiveFilters(CONTACTS_SEGMENT_NAME))
    await dispatch(changeActiveFilterSegment(CONTACTS_SEGMENT_NAME, type))

    if (type === SYNCED_CONTACTS_LIST_ID) {
      handleChangeSavedSegment(activeSegment)

      return
    }

    handleFilterChange({ filters: [], flows: [] }, true)
  }

  return (
    <>
      <PageTabs
        tabs={[
          <Tab
            key="all-contact"
            label={
              <span onClick={() => clickHandler('default')}>All Contacts</span>
            }
            value="all-contact"
          />,
          <Tab key="saved" label={<SavedSegments {...savedListProps} />} />,
          <Tab
            key="synced-contact"
            label={
              <span onClick={() => clickHandler(SYNCED_CONTACTS_LIST_ID)}>
                Synced Contacts
                <Box display="inline-flex" ml={0.5}>
                  <Badge large appearance="success">
                    4
                  </Badge>
                </Box>
              </span>
            }
            value="synced-contact"
          />,
          <TabSpacer key="space" />,
          <Tab key="sort" label={<SortFields {...sortProps} />} />
        ]}
      />
      {filter.show && (
        <ContactFilters
          contactCount={contactCount}
          onFilterChange={() => handleFilterChange({}, true)}
          users={users}
        />
      )}
    </>
  )
}

export default ContactsTabs
