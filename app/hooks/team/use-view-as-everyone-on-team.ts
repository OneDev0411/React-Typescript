import { viewAsEveryoneOnTeam } from 'utils/user-teams'

import { useUnsafeActiveTeam } from './use-unsafe-active-team'

export function useViewAsEveryoneOnTeam(): boolean {
  const activeTeam = useUnsafeActiveTeam()

  return viewAsEveryoneOnTeam(activeTeam)
}
