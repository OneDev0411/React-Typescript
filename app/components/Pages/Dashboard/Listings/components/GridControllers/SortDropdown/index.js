import React, { useState } from 'react'
import { MenuItem } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

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
  const activeSortIndex = sortOptions.findIndex(
    item =>
      item.value === activeSort.index && item.ascending === activeSort.ascending
  )
  const [selectedSortIndex, setSelectedSortIndex] = useState(
    activeSortIndex || 0
  )

  const handleSortDropdownItemClick = (event, index) => {
    onChangeSort(event)
    setSelectedSortIndex(index)
  }

  return (
    <BaseDropdown
      buttonLabel={sortOptions[selectedSortIndex].label}
      renderMenu={({ close }) => (
        <div>
          {sortOptions.map((sortOption, index) => (
            <MenuItem
              key={sortOption.label}
              data-sort={
                sortOption.ascending ? sortOption.value : `-${sortOption.value}`
              }
              selected={index === selectedSortIndex}
              onClick={event => {
                handleSortDropdownItemClick(event, index)
                close()
              }}
            >
              {sortOption.label}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}

export default SortDropdown
