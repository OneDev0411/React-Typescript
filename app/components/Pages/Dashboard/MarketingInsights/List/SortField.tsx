import React from 'react'

import { MenuItem } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

interface Props {
  sortLabel: string
  onChange: (item) => void
  component?: string
}
interface SortableColumnsType {
  label: string
  value: string
  ascending: boolean
}

const sortableColumns: SortableColumnsType[] = [
  { label: 'Newest', value: 'title-date', ascending: false },
  { label: 'Oldest', value: 'title-date', ascending: true }
]

const SortFields = ({ sortLabel, component, onChange }: Props) => {
  return (
    <BaseDropdown
      component={component}
      buttonLabel={sortLabel || 'A - Z'}
      renderMenu={({ close }) => (
        <div>
          {sortableColumns.map((c, index) => (
            <MenuItem
              key={index}
              value={index}
              onClick={async () => {
                onChange(c)
                close()
              }}
            >
              {c.label}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}

export default SortFields
