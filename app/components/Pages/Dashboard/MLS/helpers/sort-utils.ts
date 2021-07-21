export const SORT_FIELD_SETTING_KEY = 'mls_sort_field'
export const LAST_BROWSING_LOCATION = 'mls_last_browsing_location'
export const SORT_FIELD_DEFAULT = 'price'

import { getUserSettingsInActiveTeam } from 'utils/user-teams'

export const parsSortIndex = (sort: string) => {
  let index = sort
  const isDescending = index.charAt(0) === '-'

  if (isDescending) {
    index = index.slice(1)
  }

  return {
    index,
    ascending: !isDescending
  }
}

export const getDefaultSort = (user: IUser) => {
  const sortIndex = getUserSettingsInActiveTeam(user, SORT_FIELD_SETTING_KEY)

  return typeof sortIndex === 'string' ? sortIndex : SORT_FIELD_DEFAULT
}

export const sortByIndex = (
  a: IListing,
  b: IListing,
  index: string,
  ascending: boolean
) => (ascending ? a[index] - b[index] : b[index] - a[index])

export const getUserLastBrowsingLocation = (user: IUser) => {
  return getUserSettingsInActiveTeam(user, LAST_BROWSING_LOCATION)
}
