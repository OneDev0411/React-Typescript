import React, { useState } from 'react'
import { MenuItem, Popover, useTheme } from '@material-ui/core'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

import { sortOptions as sorts } from '../../../helpers/sort-plugin-options'

const sortOptions = [
  ...sorts.columns,
  {
    label: 'Distance (High-Low)',
    value: 'distanceFromCenter',
    ascending: true
  },
  {
    label: 'Distance (Low-High)',
    value: 'distanceFromCenter',
    ascending: false
  }
]

const SortDropdown = ({ onChangeSort, activeSort }) => {
  const theme = useTheme()
  const [sortDropdownAnchorEl, setSortDropdownAnchorEl] = useState(null)
  const activeSortIndex = sortOptions.findIndex(
    item =>
      item.value === activeSort.index && item.ascending === activeSort.ascending
  )
  const [selectedSortIndex, setSelectedSortIndex] = useState(
    activeSortIndex || 0
  )

  const handleViewSwitcherToggle = event => {
    if (sortDropdownAnchorEl) {
      setSortDropdownAnchorEl(null)

      return
    }

    event && setSortDropdownAnchorEl(event.currentTarget)
  }

  const handleSortDropdownItemClick = (event, index) => {
    onChangeSort(event)
    setSelectedSortIndex(index)
    setSortDropdownAnchorEl(null)
  }

  return (
    <>
      <DropdownToggleButton
        isActive={Boolean(sortDropdownAnchorEl)}
        onClick={handleViewSwitcherToggle}
      >
        {sortOptions[selectedSortIndex].label}
      </DropdownToggleButton>

      <Popover
        id={sortDropdownAnchorEl ? 'sorting-popover' : undefined}
        open={Boolean(sortDropdownAnchorEl)}
        anchorEl={sortDropdownAnchorEl}
        onClose={() => handleViewSwitcherToggle()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        style={{ zIndex: Number(theme.zIndex.gridAction) + 1 }}
      >
        {sortOptions.map((sortOption, index) => (
          <MenuItem
            key={sortOption.label}
            data-sort={
              sortOption.ascending ? sortOption.value : `-${sortOption.value}`
            }
            selected={index === selectedSortIndex}
            onClick={event => handleSortDropdownItemClick(event, index)}
          >
            {sortOption.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  )
}

export default SortDropdown
