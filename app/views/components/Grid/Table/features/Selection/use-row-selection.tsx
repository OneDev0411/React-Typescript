import React from 'react'

// import { Checkbox } from '@material-ui/core'

import { TableColumn, RenderProps, GridSelectionOptions } from '../../types'
import { useGridContext } from '../../hooks/use-grid-context'

import { SELECTION__TOGGLE_ROW } from '../../context/constants'
import { getRowId } from '../../helpers/get-row-id'
import { isRowSelected } from './helpers/is-row-selected'

import Checkbox from './Checkbox'

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
      header: '',
      render: (rowItem: RenderProps<Row>) => {
        const showDefaultValue =
          options.defaultRender &&
          state.selection.selectedRowIds.length === 0 &&
          !state.selection.isAllRowsSelected &&
          !state.selection.isEntireRowsSelected

        return (
          <div style={{ width: '48px' }}>
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
            >
              <Checkbox
                checked={isRowSelected<Row>(
                  state,
                  rowItem.row,
                  rowItem.rowIndex
                )}
                onChange={() => handleToggleRow(rowItem)}
              />
            </div>
          </div>
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
