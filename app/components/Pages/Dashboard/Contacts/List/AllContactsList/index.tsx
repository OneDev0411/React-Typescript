import React, { useMemo } from 'react'
import { connect } from 'react-redux'

import { IAppState } from 'reducers'
import { resetActiveFilters as resetActiveFiltersAction } from 'actions/filter-segments/active-filters'
import { selectActiveFilters } from 'reducers/filter-segments'

import ToolTip from 'components/tooltip'
import {
  ListTitle,
  ListItem,
  ListItemName
} from 'components/Grid/SavedSegments/List/styled'

import { changeActiveFilterSegment as changeActiveFilterSegmentAction } from 'actions/filter-segments/change-active-segment'

import { CONTACTS_SEGMENT_NAME } from '../../constants'
import {
  SYNCED_CONTACTS_LIST_ID,
  DUPLICATE_CONTACTS_LIST_ID
} from '../constants'
import { getSyncedContacts, SyncedContacts } from '../utils/get-synced-contacts'

interface Props {
  onFilterChange: (selectedSegment: unknown, type: string) => void
  resetActiveFilters: (segmentName: string) => void
  activeFilters: StringMap<IActiveFilter>
  changeActiveFilterSegment: typeof changeActiveFilterSegmentAction
  activeSegment: any
  syncedContacts: SyncedContacts
}

function AllContactsList({
  onFilterChange,
  activeFilters,
  resetActiveFilters,
  changeActiveFilterSegment,
  activeSegment,
  syncedContacts
}: Props) {
  const isAllContactsSelected = useMemo(() => {
    return (
      Object.values(activeFilters).length === 0 &&
      (!activeSegment || activeSegment.id === 'default')
    )
  }, [activeFilters, activeSegment])
  const isSyncedListSelected =
    activeSegment && activeSegment.id === SYNCED_CONTACTS_LIST_ID
  const isDuplicatesListSelected =
    activeSegment && activeSegment.id === DUPLICATE_CONTACTS_LIST_ID

  const clickHandler = async (type: string) => {
    await resetActiveFilters(CONTACTS_SEGMENT_NAME)
    await changeActiveFilterSegment(CONTACTS_SEGMENT_NAME, type)

    let selectedSegment: ISavedSegment | null = null

    if (type === SYNCED_CONTACTS_LIST_ID) {
      selectedSegment = activeSegment
    }

    if (type === DUPLICATE_CONTACTS_LIST_ID) {
      selectedSegment = {
        id: DUPLICATE_CONTACTS_LIST_ID,
        name: 'Duplicates',
        is_editable: false,
        filters: []
      }
    }

    onFilterChange(selectedSegment, type)
  }

  return (
    <div style={{ margin: '0 0 2rem' }} data-test="tags-list">
      <ListTitle>
        <span>Contacts</span>
      </ListTitle>

      <ToolTip caption="All my contacts" placement="right">
        <ListItem
          isSelected={isAllContactsSelected}
          onClick={() => clickHandler('default')}
        >
          <ListItemName>All Contacts</ListItemName>
        </ListItem>
      </ToolTip>
      {syncedContacts.accounts > 0 && (
        <ListItem
          isSelected={isSyncedListSelected}
          onClick={() => clickHandler(SYNCED_CONTACTS_LIST_ID)}
        >
          <ListItemName>Synced Contacts</ListItemName>
        </ListItem>
      )}
      <ListItem
        isSelected={isDuplicatesListSelected}
        onClick={() => clickHandler(DUPLICATE_CONTACTS_LIST_ID)}
      >
        <ListItemName>Duplicates</ListItemName>
      </ListItem>
    </div>
  )
}

function mapStateToProps(state: IAppState) {
  return {
    activeFilters: selectActiveFilters(state.contacts.filterSegments),
    syncedContacts: getSyncedContacts(state)
  }
}

export default connect(mapStateToProps, {
  resetActiveFilters: resetActiveFiltersAction,
  changeActiveFilterSegment: changeActiveFilterSegmentAction
})(AllContactsList as React.FC)
