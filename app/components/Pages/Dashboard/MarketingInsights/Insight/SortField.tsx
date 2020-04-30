import React from 'react'
import { MenuItem } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

interface Props {
  sortLabel: string
  onChange: (item) => void
}

export interface SortableColumnsType {
  label: string
  value: string
  ascending: boolean
}

const sortableColumns: SortableColumnsType[] = [
  { label: 'Name A-Z', value: 'contact', ascending: true },
  { label: 'Name Z-A', value: 'contact', ascending: false },
  { label: 'Most Clicked', value: 'clicked', ascending: false },
  { label: 'Less Clicked', value: 'clicked', ascending: true },
  { label: 'Most Opened', value: 'opened', ascending: false },
  { label: 'Less Opened', value: 'opened', ascending: true }
]

const SortFields = ({ sortLabel, onChange }: Props) => {
  return (
    <BaseDropdown
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
