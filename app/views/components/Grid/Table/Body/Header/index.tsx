import { alpha, makeStyles } from '@material-ui/core'

import { ToggleEntireRows } from '../../features/Selection/ToggleEntireRows'
import { GridSelectionOptions, TableColumn } from '../../types'

const useStyles = makeStyles(
  theme => ({
    rowContainer: {
      height: '40px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',

      backgroundColor: `${alpha(theme.palette.grey[50], 0.75)}`,
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,

      '& > div': {
        display: 'flex',
        flex: '0 0 auto',

        '&:first-child': {
          borderRight: 'none'
        }
      }
    },
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
  totalRows: number
  selection: GridSelectionOptions<Row> | null
  inlineGridEnabled?: boolean
  columnsSize: string[]
}

function Header<Row>({ columns, rows, totalRows }: Props<Row>) {
  const classes = useStyles()

  const Cell = (cellContent, column, columnIndex) => (
    <div
      className={classes.cellContainer}
      key={columnIndex}
      style={{ width: column.width ?? '180px' }}
    >
      {cellContent}
    </div>
  )

  const getCell = (column, columnIndex) => {
    if (column.isHidden) {
      return null
    }

    if (typeof column.headerName === 'string') {
      return Cell(column.headerName, column, columnIndex)
    }

    if (typeof column.headerName === 'function') {
      return Cell(
        column.headerName({
          rows,
          column,
          columnIndex,
          totalRows
        }),
        column,
        columnIndex
      )
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

export default Header
