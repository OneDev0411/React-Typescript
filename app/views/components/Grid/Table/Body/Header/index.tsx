import { memo, useMemo } from 'react'

import { alpha, makeStyles } from '@material-ui/core'

import { ToggleEntireRows } from '../../features/Selection/ToggleEntireRows'
import { getColumnsSize } from '../../helpers/get-columns-size'
import { GridSelectionOptions, TableColumn } from '../../types'

const useStyles = makeStyles(
  theme => ({
    rowContainer: ({ rowSize }: { rowSize: number }) => ({
      height: theme.spacing(rowSize),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',

      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,

      '& > div:first-child': {
        borderRight: 'none'
      }
    }),
    cellContainer: {
      height: '100%',
      display: 'flex',
      alignSelf: 'center',
      alignItems: 'center',
      borderRight: `1px solid ${alpha(theme.palette.divider, 0.06)}`
    }
  }),
  { name: 'Header-row' }
)

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: (Row & { id?: UUID })[]
  totalRows: number
  selection: GridSelectionOptions<Row> | null
  inlineGridEnabled?: boolean
  rowSize?: number
}

function Header<Row>({ columns, rows, totalRows, rowSize = 5 }: Props<Row>) {
  const columnsSize = useMemo(() => getColumnsSize<Row>(columns), [columns])

  const classes = useStyles({ rowSize })

  //--

  const Cell = (cellContent, columnIndex) => (
    <div
      className={classes.cellContainer}
      key={columnIndex}
      style={{ width: columnsSize[columnIndex] }}
    >
      {cellContent}
    </div>
  )

  const getCell = (column, columnIndex) => {
    if (typeof column.headerName === 'string') {
      return Cell(column.headerName, columnIndex)
    }

    if (typeof column.headerName === 'function') {
      return Cell(
        column.headerName({
          rows,
          column,
          columnIndex,
          totalRows
        }),
        columnIndex
      )
    }
  }

  //--

  return (
    <div className={classes.rowContainer}>
      <ToggleEntireRows rows={rows} totalRows={totalRows} />
      {columns.map(getCell)}
    </div>
  )
}

export default memo(Header)
