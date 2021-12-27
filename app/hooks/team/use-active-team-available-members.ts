import { getTeamAvailableMembers } from 'utils/user-teams'

import { useUnsafeActiveTeam } from './use-unsafe-active-team'

/**
 * Returns the available members for the current active team
 */

export function useActiveTeamAvailableMembers(): IUser[] {
  const activeTeam = useUnsafeActiveTeam()

  return getTeamAvailableMembers(activeTeam)
}
