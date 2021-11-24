export const SORT_FIELD_SETTING_KEY = 'mls_sort_field'
export const LAST_BROWSING_LOCATION = 'mls_last_browsing_location'
export const SORT_FIELD_DEFAULT = '-price'

import { getUserSettingsInActiveTeam } from '@app/utils/user-teams'

import { IMapPosition, Sort, SortIndex, SortPrefix, SortString } from '../types'

export const sortOptions = {
  created_at: 'Listed Date',
  price: 'Price',
  beds: 'Bedrooms',
  baths: 'Bathrooms',
  sqft: 'Square Feet',
  lotSizeArea: 'Lot Size',
  builtYear: 'Year Built'
}

export const createSortString = (
  index: SortIndex,
  ascending: boolean
): SortString => {
  const sortPrefix: SortPrefix = ascending ? '' : '-'

  return `${sortPrefix}${index}` as SortString
}

export const parseSortIndex = (sort: SortString): Sort => {
  const isDescending = sort.charAt(0) === '-'
  let index = (isDescending ? sort.slice(1) : sort) as SortIndex

  return {
    index,
    ascending: !isDescending
  }
}

export const getDefaultSort = (user: IUser): SortString => {
  const sortIndex = getUserSettingsInActiveTeam(user, SORT_FIELD_SETTING_KEY)

  return (
    typeof sortIndex === 'string' ? sortIndex : SORT_FIELD_DEFAULT
  ) as SortString
}

export const sortByIndex = (
  a: ICompactListing,
  b: ICompactListing,
  index: string,
  ascending: boolean
) => (ascending ? a[index] - b[index] : b[index] - a[index])

export const getUserLastBrowsingLocation = (user: IUser) => {
  return getUserSettingsInActiveTeam(
    user,
    LAST_BROWSING_LOCATION
  ) as Optional<IMapPosition>
}

export function parseToValertSort(sort: SortIndex): string {
  const sortMap: Record<SortIndex, string> = {
    beds: 'bedrooms',
    baths: 'bathrooms',
    price: 'price',
    sqft: 'square_feet',
    created_at: 'list_date',
    builtYear: 'year_built',
    lotSizeArea: 'lot_size'
  }

  return sortMap[sort]
}
