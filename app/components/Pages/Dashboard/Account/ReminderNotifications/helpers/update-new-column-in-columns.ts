import { ColumnState } from '../types'

export function updateNewColumnInColumns(
  newColumn: ColumnState,
  columns: readonly ColumnState[]
): ColumnState[] {
  return columns.map(column =>
    column.objectType === newColumn.objectType ? newColumn : column
  )
}
