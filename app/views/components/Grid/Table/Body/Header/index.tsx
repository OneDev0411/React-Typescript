import { memo, useMemo } from 'react'

import { Checkbox, Tooltip } from '@material-ui/core'
import cn from 'classnames'

import { useGridStyles } from 'components/Grid/Table/styles'

import { SELECTION__TOGGLE_ENTIRE_ROWS } from '../../context/constants'
import { getColumnsSize } from '../../helpers/get-columns-size'
import { useGridContext } from '../../hooks/use-grid-context'
import { GridSelectionOptions, TableColumn } from '../../types'

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: (Row & { id?: UUID })[]
  totalRows: number
  selection: GridSelectionOptions<Row> | null
}

function Header<Row>({ columns, rows, selection, totalRows }: Props<Row>) {
  const columnsSize = useMemo(() => getColumnsSize<Row>(columns), [columns])
  const gridClasses = useGridStyles(true)
  const [state, dispatch] = useGridContext()
  const {
    isAllRowsSelected,
    isEntireRowsSelected,
    selectedRowIds,
    excludedRows
  } = state.selection

  const isAllSelected =
    isAllRowsSelected ||
    selectedRowIds.length === rows.length ||
    (isEntireRowsSelected && excludedRows.length === 0)

  const isSomeRowsSelected =
    (isAllRowsSelected === false &&
      selectedRowIds.length > 0 &&
      selectedRowIds.length < rows.length) ||
    (isEntireRowsSelected && excludedRows.length > 0)

  const tooltipTitle =
    isAllSelected || isEntireRowsSelected
      ? 'Deselect All Rows'
      : 'Select All Rows'

  const toggleAll = () =>
    dispatch({
      type: SELECTION__TOGGLE_ENTIRE_ROWS
    })

  const defaultSelectAllValue =
    Number(rows.length) === 0 ? false : isAllSelected

  const isSelectAllDisable = Number(rows.length) === 0

  const SelectBox = (
    <div>
      <Tooltip title={tooltipTitle}>
        <Checkbox
          disableRipple
          disabled={isSelectAllDisable}
          checked={defaultSelectAllValue}
          indeterminate={isSomeRowsSelected}
          onChange={toggleAll}
          data-tour-id="select-deselect-checkbox"
        />
      </Tooltip>
    </div>
  )

  return (
    <div
      className={cn({
        [gridClasses.header]: true,
        [gridClasses.headerHasSelected]: !!selection
      })}
    >
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} style={{ width: columnsSize[columnIndex] }}>
          {typeof column.headerName === 'string'
            ? column.headerName
            : typeof column.headerName === 'function'
            ? column.headerName({
                rows,
                column,
                columnIndex,
                totalRows
              })
            : selection && column.id === 'row-selection'
            ? SelectBox
            : ''}
        </div>
      ))}
    </div>
  )
}

export default memo(Header)
