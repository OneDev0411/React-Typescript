import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { PageTabs, Tab } from 'components/PageTabs'
import SavedSegments from 'components/Grid/SavedSegments/List'
import { resetActiveFilters } from 'actions/filter-segments/active-filters'
import { changeActiveFilterSegment } from 'actions/filter-segments/change-active-segment'
import { IAppState } from 'reducers'
import { selectActiveFilters } from 'reducers/filter-segments'

import {
  getSyncedContacts,
  SyncedContacts as SyncedContactsTypes
} from '../utils/get-synced-contacts'
import { CONTACTS_SEGMENT_NAME } from '../../constants'
import { PARKED_CONTACTS_LIST_ID } from '../constants'

import { SortFields } from '../SortFields'
import ContactFilters from '../Filters'
import TagsList from '../TagsList'

interface Props {
  handleFilterChange: (newFilters: object, resetLoadedRanges: boolean) => void
  handleChangeSavedSegment: (savedSegment: object) => void
  handleResetShortcutFilter: () => void
  filter: {
    show: boolean
  }
  tagListProps: {
    onClick: ({ filters: any }) => void
    isActive: boolean
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

const getActiveTab = ({
  isAllContactsActive,
  isSyncedListActive,
  isTagListActive
}) => {
  if (isAllContactsActive) {
    return 'all-contact'
  }

  if (isSyncedListActive) {
    return 'parked-contact'
  }

  if (isTagListActive) {
    return 'tag-list'
  }

  return 'saved-list'
}

export const ContactsTabs = ({
  handleResetShortcutFilter,
  handleChangeSavedSegment,
  handleFilterChange,
  savedListProps,
  activeSegment,
  contactCount,
  tagListProps,
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
    activeSegment && activeSegment.id === PARKED_CONTACTS_LIST_ID

  const activeTab = getActiveTab({
    isAllContactsActive,
    isSyncedListActive,
    isTagListActive: tagListProps.isActive
  })

  const clickHandler = async (type: string) => {
    await dispatch(resetActiveFilters(CONTACTS_SEGMENT_NAME))
    await dispatch(changeActiveFilterSegment(CONTACTS_SEGMENT_NAME, type))

    if (type === PARKED_CONTACTS_LIST_ID) {
      return handleFilterChange({ parked: true }, true)
    }

    handleFilterChange({ filters: [], flows: [] }, true)
    handleResetShortcutFilter()
  }

  const syncedContactsTab =
    syncedContacts.accounts > 0 ? (
      <Tab
        key="parked-contact"
        value="parked-contact"
        label={
          <span onClick={() => clickHandler(PARKED_CONTACTS_LIST_ID)}>
            Parked Contacts
          </span>
        }
      />
    ) : null

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
          syncedContactsTab,
          <Tab
            key="saved-list"
            value="saved-list"
            label={<SavedSegments {...savedListProps} />}
          />,
          <Tab
            key="tag-list"
            value="tag-list"
            label={<TagsList onFilterChange={tagListProps.onClick} />}
          />
        ]}
        actions={[<Tab key="sort" label={<SortFields {...sortProps} />} />]}
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
