import React from 'react'
import { MenuItem } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

import { SortValues } from './helpers'

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
  { label: 'Name A-Z', value: SortValues.ALPHABETICAL, ascending: true },
  { label: 'Name Z-A', value: SortValues.ALPHABETICAL, ascending: false },
  { label: 'Bounced', value: SortValues.BOUNCED, ascending: true },
  { label: 'Unsubscribed', value: SortValues.UNSUBSCRIBED, ascending: true },
  { label: 'Most Clicked', value: SortValues.MOST_CLICKED, ascending: false },
  { label: 'Less Clicked', value: SortValues.MOST_CLICKED, ascending: true },
  { label: 'Most Opened', value: SortValues.MOST_OPENED, ascending: false },
  { label: 'Less Opened', value: SortValues.MOST_OPENED, ascending: true }
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
