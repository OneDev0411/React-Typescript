import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@material-ui/core'

import { PageTabs, Tab, TabSpacer } from 'components/PageTabs'
import SavedSegments from 'components/Grid/SavedSegments/List'
import Badge from 'components/Badge'
import { resetActiveFilters } from 'actions/filter-segments/active-filters'
import { changeActiveFilterSegment } from 'actions/filter-segments/change-active-segment'
import { IAppState } from 'reducers'
import { selectActiveFilters } from 'reducers/filter-segments'

import {
  getSyncedContacts,
  SyncedContacts as SyncedContactsTypes
} from '../utils/get-synced-contacts'
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
  syncedContacts: SyncedContactsTypes
}

interface ReduxStateType {
  syncedContacts: SyncedContactsTypes
  activeFilters: StringMap<IActiveFilter>
}

const getActiveTab = ({ isAllContactsActive, isSyncedListActive }) => {
  if (isAllContactsActive) {
    return 'all-contact'
  }

  if (isSyncedListActive) {
    return 'synced-contact'
  }

  return 'saved-list'
}

export const ContactsTabs = ({
  handleChangeSavedSegment,
  handleFilterChange,
  savedListProps,
  activeSegment,
  contactCount,
  sortProps,
  filter,
  users
}: Props) => {
  const dispatch = useDispatch()
  const { syncedContacts, activeFilters }: ReduxStateType = useSelector(
    (state: IAppState) => ({
      activeFilters: selectActiveFilters(state.contacts.filterSegments),
      syncedContacts: getSyncedContacts(state)
    })
  )
  const isAllContactsActive = useMemo(() => {
    return (
      Object.values(activeFilters).length === 0 &&
      (!activeSegment || activeSegment.id === 'default')
    )
  }, [activeFilters, activeSegment])
  const isSyncedListActive =
    activeSegment && activeSegment.id === SYNCED_CONTACTS_LIST_ID
  const activeTab = getActiveTab({ isAllContactsActive, isSyncedListActive })

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
        defaultValue={activeTab}
        tabs={[
          <Tab
            key="all-contact"
            value="all-contact"
            label={
              <span onClick={() => clickHandler('default')}>All Contacts</span>
            }
          />,
          <Tab
            key="saved-list"
            value="saved-list"
            label={<SavedSegments {...savedListProps} />}
          />,
          <Tab
            disabled={syncedContacts.accounts <= 0}
            key="synced-contact"
            value="synced-contact"
            label={
              <span onClick={() => clickHandler(SYNCED_CONTACTS_LIST_ID)}>
                Synced Contacts
                {syncedContacts.contactsCount > 0 && (
                  <Box display="inline-flex" ml={0.5}>
                    <Badge large appearance="success">
                      {syncedContacts.contactsCount}
                    </Badge>
                  </Box>
                )}
              </span>
            }
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
