import { WithRouterProps } from 'react-router'

import { TableColumn, SortableColumn } from 'components/Grid/Table/types'
import { parseSortSetting } from 'utils/sortings/parse-sort-setting'

export const DEFAULT_SORT = 'status'

export function getActiveSort(
  team: Nullable<IUserTeam>,
  location: WithRouterProps['location'],
  sortFieldSettingKey: string
): {
  id: string
  ascending: boolean
} {
  let sort = parseSortSetting(team, sortFieldSettingKey, DEFAULT_SORT)

  if (location.query.sortBy) {
    sort = {
      id: location.query.sortBy,
      ascending: location.query.sortType === 'asc'
    }
  }

  return sort
}

export function getGridSort(
  team: Nullable<IUserTeam>,
  columns: TableColumn<IDeal>[],
  location: WithRouterProps['location'],
  sortFieldSettingKey: string
) {
  const sort = getActiveSort(team, location, sortFieldSettingKey)

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
  team: Nullable<IUserTeam>,
  columns: SortableColumn[],
  location: WithRouterProps['location'],
  sortFieldSettingKey: string
): string {
  const defaultValue = 'A - Z'
  const sort = getActiveSort(team, location, sortFieldSettingKey)

  const column = columns.find(
    item => item.value === sort.id && item.ascending === sort.ascending
  )

  return column && column.label ? column.label : defaultValue
}
