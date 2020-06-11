import React, { CSSProperties, memo } from 'react'

import cn from 'classnames'

import { resolveAccessor } from '../../helpers/resolve-accessor'

import { StateContext } from '../../context'
import { TableColumn, TrProps, TdProps, GridClasses } from '../../types'

import { RowContainer } from './styled'

interface Props<Row> {
  index: number
  style: CSSProperties
  data: {
    rows: Row[]
    columns: TableColumn<Row>[]
    state: StateContext
    classes: GridClasses
    columnsSize: string[]
    getTrProps?: (data: TrProps<Row>) => object
    getTdProps?: (data: TdProps<Row>) => object
  }
}

function Row<T>({
  index: rowIndex,
  style,
  data: {
    columns,
    rows,
    state,
    classes,
    columnsSize,
    getTrProps = () => ({}),
    getTdProps = () => ({})
  }
}: Props<T & { id?: string }>) {
  const row = rows[rowIndex]

  const isRowSelected =
    state.selection.isAllRowsSelected ||
    state.selection.isEntireRowsSelected ||
    state.selection.selectedRowIds.includes(row.id || rowIndex.toString())

  return (
    <RowContainer
      index={rowIndex}
      selected={isRowSelected}
      className={classes.row}
      style={style}
      {...getTrProps({
        rowIndex,
        row,
        selected: isRowSelected
      })}
    >
      {columns
        .filter((column: TableColumn<T>) => column.render)
        .map((column: TableColumn<T>, columnIndex: number) => (
          <div
            key={columnIndex}
            className={cn('column', column.class, {
              primary: column.primary === true
            })}
            style={{
              width: columnsSize[columnIndex],
              textAlign: column.align || 'left',
              ...(column.rowStyle || {}),
              ...(column.style || {})
            }}
            {...getTdProps({
              columnIndex,
              column,
              rowIndex,
              row
            })}
          >
            {getCell(column, row, rowIndex, columnIndex, rows.length)}
          </div>
        ))}
    </RowContainer>
  )
}

function getCell<Row>(
  column: TableColumn<Row>,
  row: Row,
  rowIndex: number,
  columnIndex: number,
  totalRows: number
) {
  if (column.render) {
    return column.render({
      row,
      totalRows,
      rowIndex,
      columnIndex
    })
  }

  return null
}

export default memo(Row)
