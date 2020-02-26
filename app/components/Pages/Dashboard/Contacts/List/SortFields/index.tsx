import React from 'react'
import { MenuItem } from '@material-ui/core'

import { putUserSetting } from 'models/user/put-user-setting'

import { BaseDropdown } from 'components/BaseDropdown'

import { SORT_FIELD_SETTING_KEY } from '../constants'

interface Props {
  onChange: (item) => void
}
interface SortableColumnsType {
  label: string
  value: string
  ascending: boolean
}

const sortableColumns: SortableColumnsType[] = [
  { label: 'Most Recent', value: 'updated_at', ascending: false },
  { label: 'Last Touch', value: 'last_touch', ascending: false },
  { label: 'First name A-Z', value: 'display_name', ascending: true },
  { label: 'First name Z-A', value: 'display_name', ascending: false },
  { label: 'Last name A-Z', value: 'sort_field', ascending: true },
  { label: 'Last name Z-A', value: 'sort_field', ascending: false },
  { label: 'Created At', value: 'created_at', ascending: true }
]

export const SortFields = ({ onChange }: Props) => {
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
                await putUserSetting(SORT_FIELD_SETTING_KEY, c.value)
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
