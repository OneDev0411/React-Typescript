import React from 'react'
import {
  TableCell,
  TableHead,
  TableRow,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

import { TableColumn } from '../types'

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    column: {
      padding: 0,
      borderBottom: 'none',
      height: theme.spacing(8)
    }
  })
)

export function Header<Row>({ columns, rows }: Props<Row>) {
  const classes = useStyles()

  return (
    <TableHead>
      <TableRow>
        {columns.map((column: TableColumn<Row>, index: number) => (
          <TableCell
            key={index}
            align={column.align || 'inherit'}
            className={classes.column}
            style={{
              width: column.width || 'inherit',
              ...(column.headerStyle || {}),
              ...(column.style || {})
            }}
          >
            {typeof column.header === 'function'
              ? column.header({
                  column,
                  rows,
                  columnIndex: index,
                  totalRows: rows.length
                })
              : column.header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
