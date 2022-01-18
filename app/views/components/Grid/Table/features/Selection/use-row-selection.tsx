import { SELECTION__TOGGLE_ROW } from '../../context/constants'
import { getRowId } from '../../helpers/get-row-id'
import { useGridContext } from '../../hooks/use-grid-context'
import { TableColumn, RenderProps, GridSelectionOptions } from '../../types'

import ToggleRow from './ToggleRow'

export function useRowsSelection<Row>(
  columns: TableColumn<Row>[],
  rows: Row[],
  options: GridSelectionOptions<Row>
): {
  columns: TableColumn<Row>[]
  rows: Row[]
} {
  const [, dispatch] = useGridContext()

  const handleToggleRow = (rowItem: RenderProps<Row>): void => {
    const rowId = getRowId<Row>(rowItem.row, rowItem.rowIndex)

    dispatch({
      type: SELECTION__TOGGLE_ROW,
      id: rowId,
      totalRows: rowItem.totalRows
    })
  }

  const newColumns = [
    {
      id: 'row-selection',
      class: 'opaque',
      width: 'auto', // default value
      ...(options.columnProps || {}),
      render: (rowItem: RenderProps<Row>) => {
        return (
          <ToggleRow
            rowItem={rowItem}
            render={options.render}
            defaultRender={options.defaultRender}
            handleToggleRow={handleToggleRow}
          />
        )
      }
    },
    ...columns
  ]

  return {
    columns: newColumns,
    rows
  }
}
