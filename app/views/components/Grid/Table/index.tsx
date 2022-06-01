import React from 'react'

import { StateContext } from './context'
import { GridContextProvider } from './context/provider'
import { GridTable } from './Table'
import {
  TableColumn,
  GridSelectionOptions,
  GridSortingOption,
  InfiniteScrollingOptions,
  LoadingPosition,
  GridClasses,
  TrProps,
  TdProps
} from './types'

export interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
  totalRows: number
  virtualize?: boolean
  rowSize?: number
  headless?: boolean
  selection?: GridSelectionOptions<Row> | null
  sorting?: GridSortingOption | null
  infiniteScrolling?: InfiniteScrollingOptions | null
  loading?: LoadingPosition
  summary?: ((total: number, state: StateContext) => React.ReactText) | null
  TableActions?: React.ReactNode | null
  ToolbarComponent?: React.ReactNode | null
  EmptyStateComponent?: React.ReactType<any> | null
  LoadingStateComponent?: React.ReactType<any> | null
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
  classes?: GridClasses
}

export const GridProvider = GridContextProvider

export default function Grid<Row>(props: Props<Row>) {
  return (
    <GridContextProvider>
      <GridTable<Row> {...props} />
    </GridContextProvider>
  )
}

export function Table<Row>(props: Props<Row>) {
  return <GridTable<Row> {...props} />
}
