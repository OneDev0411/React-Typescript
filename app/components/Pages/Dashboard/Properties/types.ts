import { sortOptions } from './helpers/sort-utils'

export interface IMapPosition {
  center: Optional<ICoord>
  zoom: Optional<number>
}

export interface IListingUIStates {
  hover: Nullable<UUID>
  click: Nullable<UUID>
}

export type SortIndex = keyof typeof sortOptions
export type SortPrefix = '' | '-'
export type SortString = `${SortPrefix}${SortIndex}`
export type Sort = { index: SortIndex; ascending: boolean }
