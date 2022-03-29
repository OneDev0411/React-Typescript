import { getSettingFromTeam } from 'utils/user-teams'

import { useActiveTeam } from './use-active-team'

export function useTeamSetting(
  key: string,
  defaultValue?: any
): ReturnType<typeof getSettingFromTeam> {
  const activeTeam = useActiveTeam()

  return getSettingFromTeam(activeTeam, key, defaultValue)
}
