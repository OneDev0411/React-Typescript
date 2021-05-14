import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { PageTabs, Tab } from 'components/PageTabs'
import SavedSegments from 'components/Grid/SavedSegments/List'
import { resetActiveFilters } from 'actions/filter-segments/active-filters'
import { changeActiveFilterSegment } from 'actions/filter-segments/change-active-segment'
import { IAppState } from 'reducers'
import { selectActiveFilters } from 'reducers/filter-segments'

import { SyncedContacts as SyncedContactsTypes } from '../utils/get-synced-contacts'
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
  viewMode: 'table' | 'board'
  contactCount: number
  activeSegment: any
  users: UUID[]
  syncedContacts: SyncedContactsTypes
}

interface ReduxStateType {
  syncedContacts: SyncedContactsTypes
  activeFilters: StringMap<IActiveFilter>
}

const getActiveTab = ({
  isAllContactsActive,
  isParkFilterActive,
  isTagListActive
}) => {
  if (isAllContactsActive) {
    return 'all-contact'
  }

  if (isParkFilterActive) {
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
  viewMode,
  filter,
  users
}: Props) => {
  const dispatch = useDispatch()
  const { activeFilters }: Pick<ReduxStateType, 'activeFilters'> = useSelector(
    (state: IAppState) => ({
      activeFilters: selectActiveFilters(state.contacts.filterSegments)
    })
  )
  const isAllContactsActive = useMemo(() => {
    return (
      Object.values(activeFilters).length === 0 &&
      (!activeSegment || activeSegment.id === 'default')
    )
  }, [activeFilters, activeSegment])
  const isParkFilterActive =
    activeSegment && activeSegment.id === PARKED_CONTACTS_LIST_ID

  const activeTab = getActiveTab({
    isAllContactsActive,
    isParkFilterActive,
    isTagListActive: tagListProps.isActive
  })

  const clickHandler = async (type: string) => {
    await dispatch(resetActiveFilters(CONTACTS_SEGMENT_NAME))
    await dispatch(changeActiveFilterSegment(CONTACTS_SEGMENT_NAME, type))

    handleFilterChange({ filters: [], flows: [] }, true)
    handleResetShortcutFilter()
  }

  return (
    <>
      <PageTabs
        defaultValue={activeTab}
        tabs={[
          <Tab
            key="all-contact"
            value="all-contact"
            data-tour-id="all-contacts"
            label={
              <span onClick={() => clickHandler('default')}>All Contacts</span>
            }
          />,
          <Tab
            key="saved-list"
            value="saved-list"
            data-tour-id="saved-list"
            label={<SavedSegments {...savedListProps} />}
          />,
          <Tab
            key="tag-list"
            value="tag-list"
            data-tour-id="tags-list"
            label={<TagsList onFilterChange={tagListProps.onClick} />}
          />
        ]}
        actions={[<Tab key={1} label={<SortFields {...sortProps} />} />]}
      />
      {viewMode === 'table' && (
        <ContactFilters
          show={filter?.show}
          contactCount={contactCount}
          activeSegment={activeSegment}
          onFilterChange={() => handleFilterChange({}, true)}
          users={users}
        />
      )}
    </>
  )
}

export default ContactsTabs
