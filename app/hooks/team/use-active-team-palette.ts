import { getActiveTeamPalette } from 'utils/user-teams'

import { useActiveTeam } from './use-active-team'

export function useActiveTeamPalette(): ReturnType<
  typeof getActiveTeamPalette
> {
  const activeTeam = useActiveTeam()

  return getActiveTeamPalette(activeTeam)
}
