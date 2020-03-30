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
  const sortColumn = getSortColumn<Row>(columns, sortBy)
  const sort = getSortFn<Row>(columns, sortBy)

  const sortedData = sortData(data, (row, index) => {
    return sort(
      resolveAccessor(
        sortColumn ? sortColumn.accessor : row[sortBy],
        row,
        index
      )
    )
  })

  return isAscendingSort ? sortedData : sortedData.reverse()
}

function getSortFn<Row>(columns: TableColumn<Row>[], sortBy: string) {
  const column = getSortColumn(columns, sortBy)

  return column && column.sortMethod ? column.sortMethod : defaultSortMethod
}

function getSortColumn<Row>(
  columns: TableColumn<Row>[],
  sortBy: string
): TableColumn<Row> | undefined {
  return columns.find(column => column.id === sortBy)
}

function defaultSortMethod(accessor: string | number): string | number {
  if (!accessor) {
    return typeof accessor === 'string' ? '' : -Infinity
  }

  if (typeof accessor === 'number') {
    return accessor
  }

  return accessor
    .toString()
    .trim()
    .toLowerCase()
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
