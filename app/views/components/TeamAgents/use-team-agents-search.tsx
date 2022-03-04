import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'

import { normalizeTeams } from './helpers/normalize-teams'
import { NormalizedBrand } from './types'

export type UseTeamAgentsSearch = NormalizedBrand[]

function useTeamAgentsSearch(
  teamAgents: IBrand[],
  criteria: string,
  flattenTeams: boolean
): UseTeamAgentsSearch {
  const activeTeam = useUnsafeActiveTeam()

  return normalizeTeams(activeTeam, teamAgents, flattenTeams, criteria)
}

export default useTeamAgentsSearch
