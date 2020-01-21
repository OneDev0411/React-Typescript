import { TableColumn } from '../../types'

export function resolveAccessor<Row>(
  accessor: TableColumn<Row>['accessor'] | string,
  row: Row,
  rowIndex: number
) {
  if (!accessor) {
    return rowIndex
  }

  if (typeof accessor === 'string') {
    return row[accessor]
  }

  if (typeof accessor === 'function') {
    return accessor(row)
  }

  return rowIndex
}
