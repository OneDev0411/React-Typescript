import { viewAs } from 'utils/user-teams'

import { useUnsafeActiveTeam } from './use-unsafe-active-team'

export function useViewAs(shouldReturnAll: boolean = false): UUID[] {
  const activeTeam = useUnsafeActiveTeam()

  return viewAs(activeTeam, shouldReturnAll)
}
