import { alpha, makeStyles } from '@material-ui/core'

import { ToggleEntireRows } from '../../features/Selection/ToggleEntireRows'
import { GridSelectionOptions, TableColumn } from '../../types'

const useStyles = makeStyles(
  theme => ({
    rowContainer: ({ rowSize }: { rowSize: number }) => ({
      height: theme.spacing(rowSize),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',

      backgroundColor: alpha(theme.palette.grey[50], 0.75),
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`
    }),
    cellContainer: {
      height: '100%',
      display: 'flex',
      alignSelf: 'center',
      alignItems: 'center',
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
}

export function Header<Row>({
  columns,
  rows,
  totalRows = 0,
  rowSize = 5,
  columnsSize
}: Props<Row>) {
  const classes = useStyles({ rowSize })

  const Cell = ({ cellContent, columnIndex }) => (
    <div
      className={classes.cellContainer}
      key={columnIndex}
      style={{ width: columnsSize[columnIndex] }}
    >
      {cellContent}
    </div>
  )

  const getCell = (column, columnIndex) => {
    if (column.isHidden) {
      return null
    }

    const header = column.header ?? column.headerName

    if (typeof header === 'string') {
      return Cell({ cellContent: header, columnIndex })
    }

    if (typeof header === 'function') {
      return Cell({
        cellContent: header({
          rows,
          column,
          columnIndex,
          totalRows
        }),
        columnIndex
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
