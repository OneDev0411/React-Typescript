import { CSSProperties, memo } from 'react'

import cn from 'classnames'

import { StateContext } from '../../context'
import { Header } from '../../Header'
import { TableColumn, TrProps, TdProps, GridClasses } from '../../types'

import { RowContainer } from './styled'

interface Props<Row> {
  index: number
  style: CSSProperties
  data: {
    rows: Row[]
    columns: TableColumn<Row>[]
    headless: boolean
    totalRows: number
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
    totalRows,
    state,
    headless,
    classes,
    columnsSize,
    getTrProps = () => ({}),
    getTdProps = () => ({})
  }
}: Props<T & { id?: string }>) {
  if (headless === false && rowIndex === 0) {
    return (
      <Header<T>
        columns={columns}
        rows={rows}
        totalRows={totalRows}
        columnsSize={columnsSize}
        classes={classes}
        style={style}
      />
    )
  }

  const row = rows[rowIndex]

  const isRowSelected =
    state.selection.isAllRowsSelected ||
    state.selection.isEntireRowsSelected ||
    state.selection.selectedRowIds.includes(row.id || rowIndex.toString())

  return (
    <>
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
        {columns
          .filter(
            (column: TableColumn<T>) =>
              (column.render || column.accessor) && column.hidden !== true
          )
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
    </>
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
