import { CSSProperties, memo, useMemo } from 'react'

import cn from 'classnames'
import { areEqual } from 'react-window'

import { StateContext } from '../../context'
import { Header } from '../../Header'
import { TableColumn, TrProps, TdProps, GridClasses } from '../../types'
import { Column } from '../Column'

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

function Row<Row>({
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
}: Props<Row & { id?: string }>) {
  const columnsList = useMemo(
    () =>
      columns.filter(
        (column: TableColumn<Row>) =>
          (column.render || column.accessor) && column.hidden !== true
      ),
    [columns]
  )

  if (headless === false && rowIndex === 0) {
    return (
      <Header<Row>
        columns={columnsList}
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
    <RowContainer
      index={rowIndex}
      selected={isRowSelected}
      className={cn(classes.row, {
        selected: isRowSelected,
        'has-inline-edit': columnsList.some(col => !!col.renderInlineEdit)
      })}
      style={{
        ...style,
        width: undefined,
        minWidth: '100%'
      }}
      data-tour-id={`row-${rowIndex}`}
      {...getTrProps({
        rowIndex,
        row,
        selected: isRowSelected
      })}
    >
      {columnsList.map((column: TableColumn<Row>, columnIndex: number) => (
        <Column<Row>
          key={columnIndex}
          column={column}
          columnIndex={columnIndex}
          row={row}
          rowIndex={rowIndex}
          columnWidth={columnsSize[columnIndex]}
          totalRows={rows.length}
          getTdProps={getTdProps}
        />
      ))}
    </RowContainer>
  )
}

export default memo(Row, areEqual)
