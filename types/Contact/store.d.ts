declare interface IContactReduxListInfoState {
  total: number
  count: number
  type: string
  filter: IContactAttributeFilter[]
  searchInputValue: string
  searchText: string
  order: string
}

declare interface IContactReduxListState {
  textFilter: string

  ids: UUID[]
  byId: Record<UUID, IContact>

  info: IContactReduxListInfoState

  isFetching: boolean
}

declare interface IContactReduxFilterSegmentState {
  list: null | StringMap<IContactList> // leaky abstraction 😕
  isFetching: boolean
  conditionOperator: 'and' | 'or'
  activeSegmentId: string
  fetchError: null | string /* ? */
  activeFilters: StringMap<IActiveFilter>
}

declare interface IContactReduxState {
  attributeDefs: IContactAttributeDef[]
  list: IContactReduxListState
  filterSegments: IContactReduxFilterSegmentState
}
