import { useSelector } from 'react-redux'

import { selectUser } from '@app/selectors/user'

import { normalizeTeams } from './helpers/normalize-teams'
import { NormalizedBrand } from './types'

export type UseTeamAgentsSearch = NormalizedBrand[]

function useTeamAgentsSearch(
  teamAgents: IBrand[],
  criteria: string,
  flattenTeams: boolean
): UseTeamAgentsSearch {
  const user = useSelector(selectUser)

  return normalizeTeams(user, teamAgents, flattenTeams, criteria)
}

export default useTeamAgentsSearch
