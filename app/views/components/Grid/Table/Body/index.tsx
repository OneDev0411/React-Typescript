import React from 'react'
import { TableBody, createStyles, makeStyles, Theme } from '@material-ui/core'

import {
  TableColumn,
  GridSelectionOptions,
  GridClasses,
  TrProps,
  TdProps
} from '../types'

import { useGridContext } from '../hooks/use-grid-context'
import { Row } from './Row'

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
  selection: GridSelectionOptions<Row> | null
  hoverable: boolean
  classes: GridClasses
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      '& tr:nth-child(odd)': {
        backgroundColor: theme.palette.grey[50]
      }
    }
  })
)

export function Body<Row>({
  columns,
  rows,
  classes,
  selection,
  hoverable,
  getTdProps = () => ({}),
  getTrProps = () => ({})
}: Props<Row & { id?: string }>) {
  const [state] = useGridContext()

  const bodyClasses = useStyles()

  const isRowSelected = (row: Row & { id?: string }, rowIndex: number) => {
    return (
      state.selection.isAllRowsSelected ||
      state.selection.isEntireRowsSelected ||
      state.selection.selectedRowIds.includes(row.id || rowIndex.toString())
    )
  }

  return (
    <>
      <TableBody className={bodyClasses.table}>
        {rows.map((row, rowIndex: number) => {
          return (
            <Row
              key={row.id || rowIndex}
              row={row}
              rowIndex={rowIndex}
              rowsCount={rows.length}
              columns={columns}
              selection={selection}
              isSelected={isRowSelected(row, rowIndex)}
              classes={classes}
              hoverable={hoverable}
              getTdProps={getTdProps}
              getTrProps={getTrProps}
            />
          )
        })}
      </TableBody>
    </>
  )
}
