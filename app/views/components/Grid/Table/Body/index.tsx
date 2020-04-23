import React, { useRef, ComponentProps } from 'react'
import { Theme } from '@material-ui/core'

import AutoSizer from 'react-virtualized-auto-sizer'
import { WindowScroller } from 'react-virtualized'
import { useWindowSize } from 'react-use'

import { FixedSizeList } from 'react-window'

import { useTheme } from '@material-ui/styles'

import {
  TableColumn,
  GridSelectionOptions,
  GridClasses,
  TrProps,
  TdProps
} from '../types'

import { useGridContext } from '../hooks/use-grid-context'

import Row from './Row'

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
  selection: GridSelectionOptions<Row> | null
  hoverable: boolean
  classes: GridClasses
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
}

interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
  selection: GridSelectionOptions<Row> | null
  hoverable: boolean
  classes: GridClasses
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
}

export function Body<Row>({
  columns,
  rows,
  classes,
  selection,
  hoverable,
  getTdProps = () => ({}),
  getTrProps = () => ({})
}: Props<Row>) {
  const theme = useTheme<Theme>()
  const { height: windowHeight } = useWindowSize()
  const [state] = useGridContext()

  // const bodyClasses = useStyles({ selection })
  const listRef = useRef<FixedSizeList>(null)

  const handleScroll = ({ scrollTop }) => {
    listRef.current && listRef.current.scrollTo(scrollTop)
  }

  return (
    <div style={{ height: '100%' }}>
      <WindowScroller onScroll={handleScroll}>{() => <div />}</WindowScroller>

      <AutoSizer disableHeight>
        {({ width }) => (
          <FixedSizeList
            className="grid-virtual-list"
            ref={listRef}
            itemCount={rows.length}
            itemSize={theme.spacing(8)}
            width={width}
            height={windowHeight}
            itemData={
              {
                rows,
                columns,
                state,
                getTrProps,
                getTdProps
              } as ComponentProps<typeof Row>['data']
            }
            style={{
              height: '100% !important'
            }}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  )
  // return (
  //   <TableBody className={bodyClasses.table}>
  //     {rows.map((row, rowIndex: number) => {
  //       const isSelected = isRowSelected(row, rowIndex)

  //       return (
  //         <TableRow
  //           key={row.id || rowIndex}
  //           className={cn(bodyClasses.row, classes.row)}
  //           hover={hoverable}
  //           {...getTrProps({
  //             rowIndex,
  //             row,
  //             selected: isSelected
  //           })}
  //         >
  //           {columns
  //             .filter(
  //               (column: TableColumn<Row>) => column.render || column.accessor
  //             )
  //             .map((column: TableColumn<Row>, columnIndex: number) => (
  //               <TableCell
  //                 key={columnIndex}
  //                 align={column.align || 'inherit'}
  //                 classes={{
  //                   root: cn(bodyClasses.column, column.class)
  //                 }}
  //                 className={cn({
  //                   primary: column.primary === true,
  //                   selected: isSelected
  //                 })}
  //                 style={{
  //                   width: column.width || 'inherit',
  //                   ...(column.rowStyle || {}),
  //                   ...(column.style || {})
  //                 }}
  //                 {...getTdProps({
  //                   columnIndex,
  //                   column,
  //                   rowIndex,
  //                   row
  //                 })}
  //               >
  //                 {getCell(column, row, rowIndex, columnIndex, rows.length)}
  //               </TableCell>
  //             ))}
  //         </TableRow>
  //       )
  //     })}
  //   </TableBody>
  // )
}
