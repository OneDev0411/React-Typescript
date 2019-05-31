import { useCallback } from 'react'

import { TreeFn } from 'utils/tree-utils/types'
import { ITeam } from 'models/BrandConsole/types'

import { teamMatches } from '../helpers/team-matches'

export function useTeamsFilterHook(
  getChildNodes: TreeFn<ITeam>,
  searchTerm: string
) {
  const matches = useCallback(
    (team: ITeam) => {
      // performance improvement is possible by memoizing result of matches
      // because for deep nodes it's called so many times because of the
      // recursion
      return (
        teamMatches(team, searchTerm) || (team.children || []).some(matches)
      )
    },
    [searchTerm]
  )

  return useCallback(
    (parent?: ITeam) => {
      const nodes = getChildNodes(parent)

      return searchTerm ? nodes.filter(matches) : nodes
    },
    [getChildNodes, matches, searchTerm]
  )
}
