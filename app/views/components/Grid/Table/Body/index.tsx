import React from 'react'
import {
  TableBody,
  TableCell,
  TableRow,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
import cn from 'classnames'

import { resolveAccessor } from '../helpers/resolve-accessor'

import { TableColumn, GridSelectionOptions, TrProps, TdProps } from '../types'
import { useGridContext } from '../hooks/use-grid-context'

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
  selection: GridSelectionOptions<Row> | null
  hoverable: boolean
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      '& tr:nth-child(odd)': {
        backgroundColor: theme.palette.grey[50]
      }
    },
    row: ({ selection }: { selection: GridSelectionOptions<any> | null }) => {
      const br = theme.shape.borderRadius

      let styles = {
        '& td:first-child': {
          paddingLeft: theme.spacing(1),
          borderRadius: `${br}px 0 0 ${br}px`
        },
        '& td:last-child': {
          borderRadius: `0 ${br}px ${br}px 0`
        },
        '&:hover .primary': {
          color: theme.palette.primary.main,
          cursor: 'pointer'
        }
      }

      if (selection) {
        styles = {
          ...styles,
          ...{
            '&:hover .selection--default-value': {
              display: 'none !important'
            },
            '&:hover .selection--checkbox': {
              display: 'block !important '
            },
            '& .selected': {
              backgroundColor: theme.palette.action.selected
            }
          }
        }
      }

      return styles
    },
    column: {
      padding: 0,
      borderBottom: 'none',
      height: theme.spacing(8)
    }
  })
)

export function Body<Row>({
  columns,
  rows,
  selection,
  hoverable,
  getTdProps = () => ({}),
  getTrProps = () => ({})
}: Props<Row & { id?: string }>) {
  const [state] = useGridContext()

  const classes = useStyles({
    selection
  })

  const isRowSelected = (row: Row & { id?: string }, rowIndex: number) => {
    return (
      state.selection.isAllRowsSelected ||
      state.selection.isEntireRowsSelected ||
      state.selection.selectedRowIds.includes(row.id || rowIndex.toString())
    )
  }

  return (
    <>
      <TableBody className={classes.table}>
        {rows.map((row, rowIndex: number) => {
          const selected = isRowSelected(row, rowIndex)

          return (
            <TableRow
              key={row.id || rowIndex}
              className={classes.row}
              hover={hoverable}
              {...getTrProps({
                rowIndex,
                row,
                selected
              })}
            >
              {columns
                .filter((column: TableColumn<Row>) => column.render)
                .map((column: TableColumn<Row>, columnIndex: number) => (
                  <TableCell
                    key={columnIndex}
                    align={column.align || 'inherit'}
                    classes={{
                      root: classes.column
                    }}
                    className={cn({
                      primary: column.primary === true,
                      selected
                    })}
                    style={{
                      width: column.width || 'inherit',
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
                    {getCell(column, row, rowIndex, columnIndex, rows.length)}
                  </TableCell>
                ))}
            </TableRow>
          )
        })}
      </TableBody>
    </>
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

  if (column.accessor) {
    return resolveAccessor(column.accessor, row, rowIndex)
  }

  return ''
}
