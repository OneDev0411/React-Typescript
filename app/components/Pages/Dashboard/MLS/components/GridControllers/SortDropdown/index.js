import React, { useState, useEffect } from 'react'

import { MenuItem, Popover, useTheme } from '@material-ui/core'

import { sortOptions as sorts } from '@app/components/Pages/Dashboard/MLS/helpers/sort-plugin-options'
import { SORT_FIELD_DEFAULT } from '@app/components/Pages/Dashboard/MLS/helpers/sort-utils'
import { DropdownToggleButton } from 'components/DropdownToggleButton'

const sortOptions = [...sorts.columns]

const SortDropdown = ({ onChangeSort, activeSort }) => {
  const theme = useTheme()
  const [sortDropdownAnchorEl, setSortDropdownAnchorEl] = useState(null)
  const activeSortIndex = sortOptions.findIndex(
    item =>
      item.value === activeSort.index && item.ascending === activeSort.ascending
  )

  const [selectedSortIndex, setSelectedSortIndex] = useState(
    activeSortIndex && activeSortIndex !== -1 ? activeSortIndex : 0
  )

  useEffect(() => {
    // reset sort item if current selected item is removed.
    if (activeSortIndex === -1) {
      onChangeSort(SORT_FIELD_DEFAULT)
    }
  }, [activeSortIndex, onChangeSort])

  const handleViewSwitcherToggle = event => {
    if (sortDropdownAnchorEl) {
      setSortDropdownAnchorEl(null)

      return
    }

    event && setSortDropdownAnchorEl(event.currentTarget)
  }

  const handleSortDropdownItemClick = (event, index) => {
    onChangeSort(event.currentTarget.dataset.sort)
    setSelectedSortIndex(index)
    setSortDropdownAnchorEl(null)
  }

  return (
    <>
      <DropdownToggleButton
        component="div"
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
