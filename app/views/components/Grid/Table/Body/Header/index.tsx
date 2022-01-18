import { memo, useMemo } from 'react'

import cn from 'classnames'

import {
  useGridStyles,
  useInlineGridStyles
} from 'components/Grid/Table/styles'

import { ToggleEntireRows } from '../../features/Selection/ToggleEntireRows'
import { getColumnsSize } from '../../helpers/get-columns-size'
import { GridSelectionOptions, TableColumn } from '../../types'

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: (Row & { id?: UUID })[]
  totalRows: number
  selection: GridSelectionOptions<Row> | null
  inlineGridEnabled?: boolean
}

function Header<Row>({
  columns,
  rows,
  selection,
  totalRows,
  inlineGridEnabled = false
}: Props<Row>) {
  const columnsSize = useMemo(() => getColumnsSize<Row>(columns), [columns])

  const gridClasses = useGridStyles()
  const inlineGridClasses = useInlineGridStyles()

  return (
    <div
      className={cn({
        [inlineGridClasses.header]: inlineGridEnabled,
        [inlineGridClasses.headerHasSelected]: inlineGridEnabled && !!selection,
        [gridClasses.header]: !inlineGridEnabled,
        [gridClasses.headerHasSelected]: !inlineGridEnabled && !!selection
      })}
    >
      {columns.map((column, columnIndex) => {
        if (selection && column.id === 'row-selection') {
          return (
            <ToggleEntireRows
              key={columnIndex}
              rows={rows}
              totalRows={totalRows}
            />
          )
        }

        let headerCell

        if (typeof column.headerName === 'string') {
          headerCell = column.headerName
        } else if (typeof column.headerName === 'function') {
          headerCell = column.headerName({
            rows,
            column,
            columnIndex,
            totalRows
          })
        }

        return (
          <div key={columnIndex} style={{ width: columnsSize[columnIndex] }}>
            {headerCell}
          </div>
        )
      })}
    </div>
  )
}

export default memo(Header)
