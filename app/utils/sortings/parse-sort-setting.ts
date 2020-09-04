import { getUserSettingsInActiveTeam } from 'utils/user-teams'

interface SortSetting {
  id: string
  ascending: boolean
}

export function parseSortSetting(user: IUser, key: string, defaultValue = ''): SortSetting {
  const sortSetting =
    getUserSettingsInActiveTeam(user, key) || defaultValue

  let id = sortSetting
  let ascending = true

  if (sortSetting.startsWith('-')) {
    id = sortSetting.slice(1)
    ascending = false
  }

  return {
    id,
    ascending
  }
}