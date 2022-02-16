import { CSSProperties, memo, useMemo } from 'react'

import cn from 'classnames'

import { StateContext } from '../../context'
import { TableColumn, TrProps, TdProps, GridClasses } from '../../types'

import { RowContainer, GridRowContainer } from './styled'

interface Props<Row> {
  index: number
  style?: CSSProperties
  data: {
    rows: Row[]
    columns: TableColumn<Row>[]
    state: StateContext
    classes: GridClasses
    columnsSize: string[]
    getTrProps?: (data: TrProps<Row>) => object
    getTdProps?: (data: TdProps<Row>) => object
    inlineGridEnabled?: boolean
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
    getTdProps = () => ({}),
    inlineGridEnabled = false
  }
}: Props<T & { id?: string }>) {
  const row = rows[rowIndex]

  const isRowSelected = useMemo(
    () =>
      state.selection.isAllRowsSelected ||
      state.selection.isEntireRowsSelected ||
      state.selection.selectedRowIds.includes(row.id || rowIndex.toString()),
    [state.selection, row.id, rowIndex]
  )

  const rowCells = getRowCells(
    rows,
    rowIndex,
    columns,
    columnsSize,
    inlineGridEnabled,
    getTdProps,
    isRowSelected
  )

  if (inlineGridEnabled) {
    return (
      <GridRowContainer
        selected={isRowSelected}
        style={style}
        data-tour-id={`row-${rowIndex}`}
      >
        {rowCells}
      </GridRowContainer>
    )
  }

  return (
    <RowContainer
      index={rowIndex}
      selected={isRowSelected}
      className={classes.row}
      style={style}
      data-tour-id={`row-${rowIndex}`}
      {...getTrProps({
        rowIndex,
        row,
        selected: isRowSelected
      })}
    >
      {rowCells}
    </RowContainer>
  )
}

function getRowCells<Row>(
  rows,
  rowIndex,
  columns,
  columnsSize,
  inlineGridEnabled,
  getTdProps,
  isRowSelected
) {
  if (inlineGridEnabled) {
    return columns
      .filter((column: TableColumn<Row>) => !!column.render)
      .map((column: TableColumn<Row>, columnIndex: number) =>
        getCell(
          column,
          rows[rowIndex],
          rowIndex,
          columnIndex,
          rows.length,
          isRowSelected
        )
      )
  }

  return columns
    .filter((column: TableColumn<Row>) => !!column.render)
    .map((column: TableColumn<Row>, columnIndex: number) => (
      <div
        key={columnIndex}
        className={cn(column.class, column, {
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
          row: rows[rowIndex]
        })}
      >
        {getCell(
          column,
          rows[rowIndex],
          rowIndex,
          columnIndex,
          rows.length,
          isRowSelected
        )}
      </div>
    ))
}

function getCell<Row>(
  column: TableColumn<Row>,
  row: Row,
  rowIndex: number,
  columnIndex: number,
  totalRows: number,
  isRowSelected: boolean = false
) {
  if (column.render) {
    return column.render({
      column,
      row,
      totalRows,
      rowIndex,
      columnIndex,
      isRowSelected
    })
  }

  return null
}

export default memo(Row)
