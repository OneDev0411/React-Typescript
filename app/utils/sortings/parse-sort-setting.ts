import { getUserSettingsInActiveTeam } from 'utils/user-teams'

interface SortSetting {
  id: string
  ascending: boolean
}

export function parseSortSetting(user: IUser, settingKey: string, defaultValue = ''): SortSetting {
  const rawSortSetting: string =
    getUserSettingsInActiveTeam(user, settingKey) || defaultValue

  return rawSortSetting.startsWith('-') ? {
    id: rawSortSetting.slice(1),
    ascending: false
  } : {
    id: rawSortSetting,
    ascending: true
  }
}
