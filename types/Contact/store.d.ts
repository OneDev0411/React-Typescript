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

declare type IContactReduxFilterSegmentState =
  IReduxFilterSegmentState<IContactList>
