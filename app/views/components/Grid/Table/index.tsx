import React from 'react'

import { InfiniteScrollingOptions } from 'hooks/use-infinite-scroll'

import { GridContextProvider } from './context/provider'

import { GridTable } from './Table'

import {
  TableColumn,
  TableActionComponent,
  GridSelectionOptions,
  GridSortingOption,
  LoadingPosition,
  GridClasses,
  TrProps,
  TdProps
} from './types'
import { StateContext } from './context'

export interface Props<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
  totalRows: number
  selection?: GridSelectionOptions<Row> | null
  sorting?: GridSortingOption | null
  infiniteScrolling?: InfiniteScrollingOptions | null
  hasHeader?: boolean
  stickyHeader?: boolean
  hoverable?: boolean
  lazy?: boolean
  loading?: LoadingPosition
  summary?: ((total: number, state: StateContext) => React.ReactText) | null
  TableActions?: React.ReactType<TableActionComponent<Row>> | null
  ToolbarComponent?: React.ReactType<any> | null
  EmptyStateComponent?: React.ReactType<any> | null
  LoadingStateComponent?: React.ReactType<any> | null
  getTrProps?: (data: TrProps<Row>) => object
  getTdProps?: (data: TdProps<Row>) => object
  classes?: GridClasses
}

export const GridProvider = GridContextProvider

export default function Grid<Row>(props: Props<Row>) {
  return (
    <GridContextProvider<Row> sorting={props.sorting}>
      <GridTable<Row> {...props} />
    </GridContextProvider>
  )
}

export function Table<Row>(props: Props<Row>) {
  return <GridTable<Row> {...props} />
}
