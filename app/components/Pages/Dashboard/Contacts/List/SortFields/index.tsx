import React from 'react'
import _findIndex from 'lodash/findIndex'
import { MenuItem } from '@material-ui/core'

import { putUserSetting } from 'models/user/put-user-setting'

import { DropdownTab } from 'components/PageTabs'

import { SORT_FIELD_SETTING_KEY } from '../constants'

interface Props {
  onChange: (item) => void
  currentOrder: string
}
interface SortableColumnsType {
  label: string
  value: string
  ascending: boolean
}

const sortableColumns: SortableColumnsType[] = [
  { label: 'Updated At', value: '-updated_at', ascending: false },
  { label: 'Last Touch', value: '-last_touch', ascending: false },
  { label: 'First name A-Z', value: 'display_name', ascending: true },
  { label: 'First name Z-A', value: '-display_name', ascending: false },
  { label: 'Last name A-Z', value: 'sort_field', ascending: true },
  { label: 'Last name Z-A', value: '-sort_field', ascending: false },
  { label: 'Created At', value: '-created_at', ascending: false }
]

export const SortFields = ({ onChange, currentOrder }: Props) => {
  const activeOrder = _findIndex(sortableColumns, o => o.value === currentOrder)
  const buttonLabel =
    activeOrder >= 0 ? sortableColumns[activeOrder].label : 'A - Z'

  return (
    <DropdownTab title={buttonLabel}>
      {({ toggleMenu }) => (
        <>
          {sortableColumns.map((item, index) => (
            <MenuItem
              key={index}
              value={index}
              onClick={async () => {
                onChange(item)
                await putUserSetting(SORT_FIELD_SETTING_KEY, item.value)
                toggleMenu()
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </>
      )}
    </DropdownTab>
  )
}
