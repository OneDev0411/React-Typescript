import React from 'react'

import { TableCell, TableRow, Box } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'

import { useIntersection } from 'react-use'

import cn from 'classnames'

import { resolveAccessor } from '../../helpers/resolve-accessor'

import {
  TableColumn,
  GridClasses,
  TrProps,
  TdProps,
  GridSelectionOptions
} from '../../types'

interface Props<Row> {
  row: Row
  rowIndex: number
  rowsCount: number
  columns: TableColumn<Row>[]
  hoverable: boolean
  lazy: boolean
  selection: GridSelectionOptions<Row> | null
  isSelected: boolean
  classes: GridClasses
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: ({ selection }: { selection: GridSelectionOptions<any> | null }) => {
      let styles = {
        fontSize: theme.typography.body1.fontSize,
        fontWeight: theme.typography.body1.fontWeight,
        '& td:first-child': {
          paddingLeft: theme.spacing(1)
        },
        '&:hover .primary': {
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

export function Row<Row>({
  row,
  rowIndex,
  rowsCount,
  columns,
  hoverable,
  lazy,
  classes,
  isSelected,
  selection,
  getTdProps = () => ({}),
  getTrProps = () => ({})
}: Props<Row>) {
  const rowClasses = useStyles({ selection })
  const intersectionRef = React.useRef(null)
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1
  })

  const isLazyRow = lazy && intersection && intersection.intersectionRatio < 0.7
  const renderableColumns = columns.filter(
    (column: TableColumn<Row>) => column.render || column.accessor
  )

  return (
    <TableRow
      ref={intersectionRef}
      className={cn(rowClasses.row, classes.row)}
      hover={hoverable}
      {...(!isLazyRow
        ? getTrProps({
            rowIndex,
            row,
            selected: isSelected
          })
        : {})}
    >
      {isLazyRow
        ? renderableColumns.map(
            (column: TableColumn<Row>, columnIndex: number) => (
              <TableCell
                key={columnIndex}
                classes={{
                  root: rowClasses.column
                }}
                style={{
                  width: column.width || 'inherit'
                }}
              >
                {getLazyCell(column, row, rowIndex, columnIndex, rowsCount)}
              </TableCell>
            )
          )
        : renderableColumns.map(
            (column: TableColumn<Row>, columnIndex: number) => (
              <TableCell
                key={columnIndex}
                align={column.align || 'inherit'}
                classes={{
                  root: cn(rowClasses.column, column.class)
                }}
                className={cn({
                  primary: column.primary === true,
                  selected: isSelected
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
                {getCell(column, row, rowIndex, columnIndex, rowsCount)}
              </TableCell>
            )
          )}
    </TableRow>
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

function getLazyCell<Row>(
  column: TableColumn<Row>,
  row: Row,
  rowIndex: number,
  columnIndex: number,
  totalRows: number
) {
  if (column.lazyRender) {
    return column.lazyRender({
      row,
      totalRows,
      rowIndex,
      columnIndex
    })
  }

  return (
    <Box display="flex" alignItems="center" height="100%">
      <Skeleton animation={false} height="60%" width="50%" />
    </Box>
  )
}
