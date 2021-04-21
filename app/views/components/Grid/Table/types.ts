import { TableCellProps } from '@material-ui/core/TableCell'

type StringOrNumber = string | number

export interface RenderProps<Row> {
  row: Row
  totalRows: number
  rowIndex: number
  columnIndex: number
}

export interface ColumnHeaderProps<Row> {
  column: TableColumn<Row>
  rows: Row[]
  columnIndex: number
  totalRows: number
}

export interface GridClasses {
  row?: string
  tableContainer?: string
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
  sortFn?: (rows: Row[]) => Row[]
  accessor?: (row: Row) => StringOrNumber | null | undefined
  render?: (data: RenderProps<Row>) => React.ReactNode | string
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
  render?: ((rowItem: RenderProps<Row>) => React.ReactNode) | null
  defaultRender?: ((rowItem: RenderProps<Row>) => React.ReactNode) | null
  showSelectAll?: boolean
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

export interface InfiniteScrollingOptions {
  onReachStart: () => void
  onReachEnd: () => void
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
