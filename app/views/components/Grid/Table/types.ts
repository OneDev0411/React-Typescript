import { TableCellProps } from '@material-ui/core/TableCell'

import { StateContext, DispatchContext } from './context'

type StringOrNumber = string | number

export interface RenderProps<Row> {
  row: Row
  totalRows: number
  rowIndex: number
  columnIndex: number
}

export interface TableActionComponent<Row> {
  state: StateContext
  dispatch: DispatchContext
  rows: Row[]
}

export interface ColumnHeaderProps<Row> {
  column: TableColumn<Row>
  rows: Row[]
  columnIndex: number
  totalRows: number
}

export interface GridClasses {
  row?: string
}

export type ColumnHeaderFunction<Row> = (
  data: ColumnHeaderProps<Row>
) => string | React.ReactNode

export type ColumnSortType = 'number' | 'string'

export interface TableColumn<Row> {
  id: string
  header?: string | ColumnHeaderFunction<Row>
  primary?: boolean
  align?: TableCellProps['align']
  width?: string
  style?: React.CSSProperties
  headerStyle?: React.CSSProperties
  rowStyle?: React.CSSProperties
  sortable?: boolean
  sortType?: ColumnSortType
  sortTitle?: string
  class?: string
  sortMethod?: (accessor: StringOrNumber) => StringOrNumber
  accessor?: (row: Row) => StringOrNumber | null | undefined
  render?: (data: RenderProps<Row>) => React.ReactNode | string
  lazyRender?: (data: RenderProps<Row>) => React.ReactNode | string
}

export type GridHookPlugin<Row, Options> = (
  columns: TableColumn<Row>[],
  rows: Row[],
  options: Options
) => {
  columns: TableColumn<Row>[]
  rows: Row[]
}

export interface GridSelectionOptions<Row> {
  columnProps?: Omit<TableColumn<Row>, 'id'>
  defaultRender?: null | ((rowItem: RenderProps<Row>) => React.ReactNode)
}

export interface SortableColumn {
  label?: string
  value?: string
  ascending: boolean
}

export interface GridSortingOption {
  columns?: SortableColumn[]
  defaultSort?: ActiveSort
  sortBy?: ActiveSort | null
  onChange?: (item: SortableColumn) => void
}

export interface ActiveSort {
  ascending: boolean
  value?: string
  label?: string
}

export type LoadingPosition = 'top' | 'middle' | 'bottom' | null

export interface TrProps<Row> {
  rowIndex: number
  row: Row
  selected: boolean
}

export interface TdProps<Row> {
  columnIndex: number
  column: TableColumn<Row>
  rowIndex: number
  row: Row
}
