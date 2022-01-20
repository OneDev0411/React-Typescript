import { memo, useMemo } from 'react'

import { alpha, makeStyles } from '@material-ui/core'

import { ToggleEntireRows } from '../../features/Selection/ToggleEntireRows'
import { getColumnsSize } from '../../helpers/get-columns-size'
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

      '& > div:first-child': {
        borderRight: 'none'
      }
    },
    cellContainer: {
      height: '40px',
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
}

function Header<Row>({ columns, rows, selection, totalRows }: Props<Row>) {
  const columnsSize = useMemo(() => getColumnsSize<Row>(columns), [columns])

  const classes = useStyles()

  //--

  const getCell = (column, columnIndex) => {
    if (selection && column.id === 'row-selection') {
      return (
        <ToggleEntireRows key={columnIndex} rows={rows} totalRows={totalRows} />
      )
    }

    let headerCell

    if (typeof column.headerName === 'string') {
      headerCell = column.headerName
    } else if (typeof column.headerName === 'function') {
      headerCell = column.headerName({
        rows,
        column,
        columnIndex,
        totalRows
      })
    }

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

  //--

  return <div className={classes.rowContainer}>{columns.map(getCell)}</div>
}

export default memo(Header)
