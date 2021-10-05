import { MenuItem } from '@material-ui/core'
import _findIndex from 'lodash/findIndex'

import { DropdownTab } from 'components/PageTabs'

import { Props } from '../Tabs'

interface SortableColumnsType {
  label: string
  value: string
  ascending: boolean
  shouldShow?: (data: Record<string, any>) => boolean
}

const sortableColumns: SortableColumnsType[] = [
  { label: 'Updated At', value: '-updated_at', ascending: false },
  { label: 'Last Touch', value: '-last_touch', ascending: false },
  { label: 'First name A-Z', value: 'display_name', ascending: true },
  { label: 'First name Z-A', value: '-display_name', ascending: false },
  { label: 'Last name A-Z', value: 'sort_field', ascending: true },
  { label: 'Last name Z-A', value: '-sort_field', ascending: false },
  { label: 'Created At', value: '-created_at', ascending: false },
  {
    label: 'Relevance',
    value: '-last_touch_rank',
    ascending: false,
    shouldShow: data => !!data.searchValue
  }
]

export const SortFields = ({
  onChange,
  currentOrder,
  searchValue
}: Props['sortProps']) => {
  const activeOrder = _findIndex(sortableColumns, o => o.value === currentOrder)
  const buttonLabel =
    activeOrder >= 0 ? sortableColumns[activeOrder].label : 'A - Z'

  return (
    <DropdownTab component="div" title={buttonLabel}>
      {({ toggleMenu }) => (
        <>
          {sortableColumns.map((item, index) => {
            if (item.shouldShow && !item.shouldShow({ searchValue })) {
              return null
            }

            return (
              <MenuItem
                key={index}
                value={index}
                onClick={async () => {
                  onChange(item)
                  toggleMenu()
                }}
              >
                {item.label}
              </MenuItem>
            )
          })}
        </>
      )}
    </DropdownTab>
  )
}
