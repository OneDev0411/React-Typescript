import React from 'react'

import { SELECTION__TOGGLE_ROW } from '../../context/constants'
import { getRowId } from '../../helpers/get-row-id'
import { useGridContext } from '../../hooks/use-grid-context'
import {
  TableColumn,
  RenderProps,
  GridSelectionOptions,
  ColumnHeaderProps
} from '../../types'

import Checkbox from './Checkbox'
import { isRowSelected } from './helpers/is-row-selected'
import { SelectionHeaderColumn } from './SelectionHeaderColumn'

export function useRowsSelection<Row>(
  columns: TableColumn<Row>[],
  rows: Row[],
  options: GridSelectionOptions<Row>
): {
  columns: TableColumn<Row>[]
  rows: Row[]
} {
  const [state, dispatch] = useGridContext()

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
      class: 'opaque row-selection',
      width: '40px', // default value
      ...(options.columnProps || {}),
      header: (data: ColumnHeaderProps<Row>) => (
        <SelectionHeaderColumn<Row> {...data} />
      ),
      render: (rowItem: RenderProps<Row>) => {
        const showDefaultValue =
          options.defaultRender &&
          state.selection.selectedRowIds.length === 0 &&
          !state.selection.isAllRowsSelected &&
          !state.selection.isEntireRowsSelected

        return (
          <>
            <div
              className="selection--default-value"
              style={{
                display: showDefaultValue ? 'block' : 'none'
              }}
            >
              {options.defaultRender && options.defaultRender(rowItem)}
            </div>

            <div
              className="selection--checkbox"
              style={{ display: showDefaultValue ? 'none' : 'block' }}
              onClick={e => e.stopPropagation()}
            >
              {options.render ? (
                options.render(rowItem)
              ) : (
                <Checkbox
                  checked={isRowSelected<Row>(
                    state,
                    rowItem.row,
                    rowItem.rowIndex
                  )}
                  onChange={() => handleToggleRow(rowItem)}
                />
              )}
            </div>
          </>
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
