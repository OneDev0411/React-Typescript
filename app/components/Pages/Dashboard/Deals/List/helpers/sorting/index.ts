import { WithRouterProps } from 'react-router'

import { TableColumn, SortableColumn } from 'components/Grid/Table/types'
import { parseSortSetting } from 'utils/sortings/parse-sort-setting'

const DEFAULT_SORT = 'status'

export function getActiveSort(
  user: IUser,
  location: WithRouterProps['location'],
  sortFieldSettingKey: string
): {
  id: string
  ascending: boolean
} {
  let sort = parseSortSetting(user, sortFieldSettingKey, DEFAULT_SORT)

  if (location.search) {
    sort = {
      id: location.query.sortBy,
      ascending: location.query.sortType === 'asc'
    }
  }

  return sort
}

export function getGridSort(
  user: IUser,
  columns: TableColumn<IDeal>[],
  location: WithRouterProps['location'],
  sortFieldSettingKey: string
) {
  const sort = getActiveSort(user, location, sortFieldSettingKey)

  const column = columns.find(col => col.id === sort.id)

  if (!column) {
    return null
  }

  return {
    value: column.id,
    ascending: sort.ascending
  }
}

export function getGridSortLabel(
  user: IUser,
  columns: SortableColumn[],
  location: WithRouterProps['location'],
  sortFieldSettingKey: string
): string {
  const defaultValue = 'A - Z'
  const sort = getActiveSort(user, location, sortFieldSettingKey)

  const column = columns.find(
    item => item.value === sort.id && item.ascending === sort.ascending
  )

  return column && column.label ? column.label : defaultValue
}
