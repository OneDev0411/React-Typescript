import { MenuItem } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

import { SortableColumnsType } from '../types'

const sortableColumns: SortableColumnsType[] = [
  { label: 'Newest Created', value: '-created_at', ascending: false },
  { label: 'Oldest Created', value: 'created_at', ascending: true },
  { label: 'Newest Executed', value: '-executed_at', ascending: false },
  { label: 'Oldest Executed', value: 'executed_at', ascending: true }
]

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
