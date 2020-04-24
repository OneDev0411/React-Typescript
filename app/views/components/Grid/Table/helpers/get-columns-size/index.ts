import { TableColumn } from '../../types'

export function getColumnsSize<Row>(columns: TableColumn<Row>[]): string[] {
  const renderableColumns = columns.filter(col => col.render || col.accessor)
  const sizelessColumns = renderableColumns.filter(col => !col.width)

  const calc = columns
    .filter(col => col.width)
    .map(col => col.width)
    .join(' + ')

  return columns.map(
    col => col.width || `calc((100% - (${calc})) / ${sizelessColumns.length})`
  )
}
