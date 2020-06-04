import { StateContext } from '../../../../context'
import { getRowId } from '../../../../helpers/get-row-id'

export function isRowSelected<Row>(
  state: StateContext,
  row: Row,
  rowIndex: number
) {
  const rowId = getRowId<Row>(row, rowIndex)

  if (state.selection.isEntireRowsSelected) {
    return !state.selection.excludedRows.includes(rowId)
  }

  return (
    state.selection.isAllRowsSelected ||
    state.selection.isEntireRowsSelected ||
    state.selection.selectedRowIds.includes(rowId)
  )
}
