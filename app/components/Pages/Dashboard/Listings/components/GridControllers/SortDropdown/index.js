import React, { useState } from 'react'
import { MenuItem, Popover } from '@material-ui/core'

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

const SortDropdown = ({ onChangeSort }) => {
  const [sortDropdownAnchorEl, setSortDropdownAnchorEl] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(1)

  const handleViewSwitcherToggle = event => {
    if (sortDropdownAnchorEl) {
      setSortDropdownAnchorEl(null)

      return
    }

    event && setSortDropdownAnchorEl(event.currentTarget)
  }
  const handleSortDropdownItemClick = (event, index) => {
    onChangeSort(event)
    setSelectedIndex(index)
    setSortDropdownAnchorEl(null)
  }

  return (
    <>
      <DropdownToggleButton
        isActive={Boolean(sortDropdownAnchorEl)}
        onClick={handleViewSwitcherToggle}
      >
        {sortOptions[selectedIndex].label}
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
        style={{ zIndex: 10 }}
      >
        {sortOptions.map((sortOption, index) => (
          <MenuItem
            key={sortOption.label}
            data-sort={
              sortOption.ascending ? sortOption.value : `-${sortOption.value}`
            }
            selected={index === selectedIndex}
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
