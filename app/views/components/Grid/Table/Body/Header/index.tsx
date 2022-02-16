import { alpha, makeStyles } from '@material-ui/core'

import { ToggleEntireRows } from '../../features/Selection/ToggleEntireRows'
import { GridSelectionOptions, TableColumn } from '../../types'

const useStyles = makeStyles(
  theme => ({
    rowContainer: ({
      rowSize,
      width
    }: {
      rowSize: number
      width: number | string
    }) => ({
      height: theme.spacing(rowSize),
      width,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch'
    }),
    cellContainer: {
      height: '100%',
      display: 'flex',
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: alpha(theme.palette.grey[50], 0.75),

      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      borderRight: `1px solid ${alpha(theme.palette.divider, 0.06)}`
    }
  }),
  { name: 'HeaderRow' }
)

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: (Row & { id?: UUID })[]
  totalRows?: number
  selection: GridSelectionOptions<Row> | null
  rowSize?: number
  inlineGridEnabled?: boolean
  columnsSize: string[]
  width?: number | string
}

export function Header<Row>({
  columns,
  rows,
  totalRows = 0,
  rowSize = 5,
  columnsSize,
  width = '100%'
}: Props<Row>) {
  const classes = useStyles({ rowSize, width })

  const getCell = (column, columnIndex) => {
    if (column.isHidden) {
      return null
    }

    const headerCell = column.header ?? column.headerName

    if (typeof headerCell === 'string') {
      return (
        <div
          className={classes.cellContainer}
          key={columnIndex}
          style={{ width: columnsSize[columnIndex] }}
        >
          {headerCell}
        </div>
      )
    }

    if (typeof headerCell === 'function') {
      return headerCell({
        rows,
        column,
        columnIndex,
        totalRows,
        width: columnsSize[columnIndex]
      })
    }

    return null
  }

  return (
    <div className={classes.rowContainer}>
      <ToggleEntireRows rows={rows} totalRows={totalRows} />
      {columns.map(getCell)}
    </div>
  )
}
