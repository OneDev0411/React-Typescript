import { CSSProperties } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import { GridClasses, TableColumn } from '../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    column: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: `${theme.palette.grey['50']} !important`,
      color: theme.palette.grey['90']
    }
  }),
  {
    name: 'Grid-Header'
  }
)

interface Props<Row> {
  style: CSSProperties
  classes: GridClasses
  rows: Row[]
  totalRows: number
  columnsSize: string[]
  columns: TableColumn<Row>[]
}

export function Header<Row>({
  rows,
  totalRows,
  columns,
  columnsSize,
  classes,
  style
}: Props<Row>) {
  const headerClasses = useStyles()

  return (
    <div
      style={{
        ...style,
        width: undefined,
        minWidth: '100%'
      }}
      className={cn(classes.row, headerClasses.root)}
    >
      {columns
        .filter(column => column.hidden !== true)
        .map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={cn('column', headerClasses.column, column.id)}
            style={{
              width: columnsSize[columnIndex],
              textAlign: column.align || 'left',
              ...(column.headerStyle || {}),
              ...(column.style || {})
            }}
          >
            {typeof column.header === 'function'
              ? column.header({
                  column,
                  columnIndex,
                  rows,
                  totalRows,
                  width: columnsSize[columnIndex]
                })
              : column.header}
          </div>
        ))}
    </div>
  )
}
