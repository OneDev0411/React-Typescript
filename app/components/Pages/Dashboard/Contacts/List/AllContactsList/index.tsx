import React, { useCallback } from 'react'
import { connect } from 'react-redux'

import { resetActiveFilters as resetActiveFiltersAction } from 'actions/filter-segments/active-filters'
import { selectActiveFilters } from 'reducers/filter-segments'

import ToolTip from 'components/tooltip'
import { ListTitle } from 'components/Grid/SavedSegments/List/styled'
import { changeActiveFilterSegment as changeActiveFilterSegmentAction } from 'actions/filter-segments/change-active-segment'

import { normalizeAttributeFilters } from '../utils'
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
  async function clickHandler() {
    if (isSelected()) {
      return
    }

    await resetActiveFilters(CONTACTS_SEGMENT_NAME)
    await changeActiveFilterSegment(CONTACTS_SEGMENT_NAME, 'default')

    const nextFilters = {}

    onFilterChange({
      filters: normalizeAttributeFilters(nextFilters)
    })
  }

  const isSelected = useCallback(() => {
    return Object.values(activeFilters).length === 0
  }, [activeFilters])

  return (
    <div style={{ margin: '0 0 2rem' }} data-test="tags-list">
      <ToolTip caption="All my contacts" placement="right">
        <ListTitle isSelected={isSelected()} onClick={clickHandler}>
          <span>All Contacts</span>
        </ListTitle>
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
