import { useCallback } from 'react'

import { TreeFn } from 'utils/tree-utils/types'

import { teamMatches } from '../helpers/team-matches'

export function useTeamsFilterHook(
  getChildNodes: TreeFn<IBrand>,
  searchTerm: string
): TreeFn<IBrand> {
  const matches = useCallback(
    (team: IBrand) => {
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
    (parent?: IBrand) => {
      const nodes = getChildNodes(parent)

      if (!searchTerm) {
        return nodes
      }

      return nodes.filter(matches)
    },
    [getChildNodes, matches, searchTerm]
  )
}
