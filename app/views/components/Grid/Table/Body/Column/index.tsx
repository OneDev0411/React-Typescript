import { useRef } from 'react'

import { makeStyles } from '@material-ui/core'
import cn from 'classnames'

import InlineEdit, { InlineEditRef } from '../../features/InlineEdit'
import type { TableColumn, TdProps } from '../../types'

const useStyles = makeStyles(
  () => ({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }),
  {
    name: 'Grid-Column'
  }
)

interface Props<Row> {
  column: TableColumn<Row>
  columnIndex: number
  row: Row
  rowIndex: number
  columnWidth: string
  totalRows: number
  getTdProps: (data: TdProps<Row>) => object
}

export function Column<Row>({
  column,
  columnIndex,
  row,
  rowIndex,
  columnWidth,
  totalRows,
  getTdProps
}: Props<Row>) {
  const inlineEditRef = useRef<InlineEditRef>(null)
  const columnRef = useRef<HTMLDivElement>(null)
  const classes = useStyles()

  return (
    <div
      key={columnIndex}
      ref={columnRef}
      className={cn('column', column.class, {
        primary: column.primary === true,
        'inline-edit': !!column.renderInlineEdit
      })}
      style={{
        width: columnWidth,
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
      <div className={classes.root} onClick={inlineEditRef.current?.handleOpen}>
        {getCell(column, row, rowIndex, columnIndex, totalRows)}
      </div>

      {typeof column.renderInlineEdit === 'function' && (
        <InlineEdit<Row>
          columnRef={columnRef}
          innerRef={inlineEditRef}
          column={column}
          row={row}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          totalRows={totalRows}
        />
      )}
    </div>
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
