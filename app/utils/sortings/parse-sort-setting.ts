import { getSettingFromTeam } from 'utils/user-teams'

interface SortSetting {
  id: string
  ascending: boolean
}

export function parseSortSetting(
  team: Nullable<IUserTeam>,
  settingKey: string,
  defaultValue = ''
): SortSetting {
  const rawSortSetting: string = getSettingFromTeam(
    team,
    settingKey,
    defaultValue
  )

  return rawSortSetting.startsWith('-')
    ? {
        id: rawSortSetting.slice(1),
        ascending: false
      }
    : {
        id: rawSortSetting,
        ascending: true
      }
}
