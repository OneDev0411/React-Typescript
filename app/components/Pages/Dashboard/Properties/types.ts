import { formatListing } from './helpers/format-listing'
import { sortOptions } from './helpers/sort-utils'

export type IFormattedListing = GenericReturnType<
  IListing,
  typeof formatListing
>

export type IFormattedCompactListing = GenericReturnType<
  ICompactListing,
  typeof formatListing
>

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

export type ViewType = 'cards' | 'table'
