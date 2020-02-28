import React from 'react'
import { MenuItem } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

import { SortValues } from './helpers'

interface Props {
  onChange: (item) => void
}
interface SortableColumnsType {
  label: string
  value: string
  ascending: boolean
}

const sortableColumns: SortableColumnsType[] = [
  { label: 'Newest', value: SortValues.Newest, ascending: true },
  { label: 'Oldest', value: SortValues.Oldest, ascending: false }
]

const SortFields = ({ onChange }: Props) => {
  return (
    <BaseDropdown
      buttonLabel="A - Z"
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
