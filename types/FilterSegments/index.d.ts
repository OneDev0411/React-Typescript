declare interface IFilterOperator {
  name: string
  invert?: boolean
  default?: boolean
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
