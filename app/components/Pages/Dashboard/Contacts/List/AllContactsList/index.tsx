import React, { useMemo } from 'react'
import { connect } from 'react-redux'

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

interface Props {
  onFilterChange: ({ filters: any }) => void // TODO
  resetActiveFilters: (segmentName: string) => void
  activeFilters: StringMap<IActiveFilter>
  changeActiveFilterSegment: typeof changeActiveFilterSegmentAction
}

function AllContactsList({
  onFilterChange,
  activeFilters,
  resetActiveFilters,
  changeActiveFilterSegment
}: Props) {
  const isSelected = useMemo(() => {
    return Object.values(activeFilters).length === 0
  }, [activeFilters])

  const clickHandler = async () => {
    if (isSelected) {
      return
    }

    await resetActiveFilters(CONTACTS_SEGMENT_NAME)
    await changeActiveFilterSegment(CONTACTS_SEGMENT_NAME, 'default')

    onFilterChange({
      filters: []
    })
  }

  return (
    <div style={{ margin: '0 0 2rem' }} data-test="tags-list">
      <ListTitle>
        <span>Contacts</span>
      </ListTitle>

      <ToolTip caption="All my contacts" placement="right">
        <ListItem isSelected={isSelected} onClick={clickHandler}>
          <ListItemName>All Contacts</ListItemName>
        </ListItem>
      </ToolTip>
    </div>
  )
}

function mapStateToProps(state: {
  contacts: {
    list: any
    tags: any
    filterSegments: IContactReduxFilterSegmentState
  }
}) {
  return {
    activeFilters: selectActiveFilters(state.contacts.filterSegments)
  }
}

export default connect(
  mapStateToProps,
  {
    resetActiveFilters: resetActiveFiltersAction,
    changeActiveFilterSegment: changeActiveFilterSegmentAction
  }
)(AllContactsList as React.FC)
