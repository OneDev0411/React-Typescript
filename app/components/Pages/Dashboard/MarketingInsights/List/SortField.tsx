import React from 'react'

import { MenuItem } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

const sortableColumns: SortableColumnsType[] = [
  { label: 'Newest', value: 'title-date', ascending: false },
  { label: 'Oldest', value: 'title-date', ascending: true }
]

interface SortableColumnsType {
  label: string
  value: string
  ascending: boolean
}

interface Props {
  label: string
  onChange: (item: SortableColumnsType) => void
}

export const SortFields = ({ label, onChange }: Props) => {
  return (
    <BaseDropdown
      component="div"
      buttonLabel={label || 'A - Z'}
      renderMenu={({ close }) => (
        <div>
          {sortableColumns.map((column, index) => (
            <MenuItem
              key={index}
              value={index}
              onClick={() => {
                close()
                onChange(column)
              }}
            >
              {column.label}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}
