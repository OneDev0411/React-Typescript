declare type IContactFilterOperator =
  | 'eq'
  | 'lte'
  | 'gte'
  | 'between'
  | 'any'
  | 'all'
declare interface IFilterOperator {
  name: string
  invert?: boolean
  default?: boolean
  operator?: IContactFilterOperator
}

declare interface IFilterConfigRenderer {
  onFilterChange: (values: ILabelValue[], operator: IFilterOperator) => void
  onToggleFilterActive: () => void
  values: ILabelValue[]
  operator: IFilterOperator
}
declare interface IFilterConfig {
  id: string
  label: string
  renderer: (props: IFilterConfigRenderer) => ReactNode
  tooltip: string
}

declare interface IActiveFilter {
  id: UUID
  isActive?: boolean
  values: ILabelValue[]
  operator: IFilterOperator
}

declare interface IReduxFilterSegmentState<ListType = any> {
  list: null | StringMap<ListType>
  isFetching: boolean
  conditionOperator: 'and' | 'or'
  activeSegmentId: string
  fetchError: null | string /* ? */
  activeFilters: StringMap<IActiveFilter>
}

declare interface ISavedSegment<F = any> {
  id: UUID
  name: string
  badge?: number | string
  filters?: F[]
  is_editable: boolean
}
