import sortData from 'lodash/sortBy'

import { TableColumn, GridSortingOption, ActiveSort } from '../../types'
import { useGridContext } from '../../hooks/use-grid-context'
import { resolveAccessor } from '../../helpers/resolve-accessor'

export function useRowsSorting<Row>(
  columns: TableColumn<Row>[],
  rows: Row[],
  options: GridSortingOption
): {
  columns: TableColumn<Row>[]
  rows: Row[]
} {
  const [state] = useGridContext()
  const activeSort = options.sortBy || state.sorting.activeSort

  if (!activeSort) {
    return {
      columns,
      rows
    }
  }

  return {
    columns,
    rows: getSortedData<Row>(rows, columns, activeSort)
  }
}

function sort<Row>(
  columns: TableColumn<Row>[],
  data: Row[],
  sortBy: string,
  isAscendingSort: boolean
): Row[] {
  const column = columns.find(column => column.id === sortBy)

  let sortedData: Row[] = []

  if (column && column.sortFn) {
    sortedData = column.sortFn(data)
  } else {
    sortedData = sortData(data, (row, index) =>
      defaultSortMethod(
        resolveAccessor(column ? column.accessor : row[sortBy], row, index)
      )
    )
  }

  return isAscendingSort ? sortedData : sortedData.reverse()
}

function defaultSortMethod(accessor: string | number): string | number {
  if (!accessor) {
    return typeof accessor === 'string' ? '' : -Infinity
  }

  if (typeof accessor === 'number') {
    return accessor
  }

  return accessor.toString().trim().toLowerCase()
}

function getSortedData<Row>(
  data: Row[],
  columns: TableColumn<Row>[],
  activeSort: ActiveSort
): Row[] {
  const column = columns.find(col => col.id === activeSort.value)
  const sortBy = column ? column.id : activeSort.value
  const isAscendingSort = activeSort.ascending

  return sort<Row>(columns, data, sortBy!, isAscendingSort)
}
