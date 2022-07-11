import { useState, useCallback, Dispatch, SetStateAction } from 'react'

import useDebouncedCallback from 'use-debounce/lib/callback'

import { teamMatches } from '@app/components/Pages/Dashboard/Teams/helpers/team-matches'
import { TreeFn } from '@app/utils/tree-utils/types'

export interface UseFilterTeamsReturnType {
  filterTeams: (getChildNodes: TreeFn<IBrand>) => TreeFn<IBrand>
  searchTerm: string
  handleSearch: Dispatch<SetStateAction<string>>
}

export function useFilterTeams(
  filterFn?: (team: IBrand) => boolean
): UseFilterTeamsReturnType {
  const [query, setQuery] = useState<string>('')
  const [debouncedSetQuery] = useDebouncedCallback(setQuery, 400)

  const matches = useCallback(
    (team: IBrand) => {
      return (
        (filterFn?.(team) ?? true) &&
        (teamMatches(team, query) || (team.children || []).some(matches))
      )
    },
    [filterFn, query]
  )

  const filterTeams = useCallback(
    (getChildNodes: TreeFn<IBrand>) => {
      return (parent?: IBrand) => {
        const nodes = getChildNodes(parent)

        if (!query && !filterFn) {
          return nodes
        }

        return nodes.filter(matches)
      }
    },
    [query, filterFn, matches]
  )

  return {
    filterTeams,
    searchTerm: query,
    handleSearch: debouncedSetQuery
  }
}
