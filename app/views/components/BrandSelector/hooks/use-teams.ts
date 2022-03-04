import { useMemo, useCallback } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import useAsync from '@app/hooks/use-async'
import { getAvailableBrandsToSwitch } from '@app/models/BrandConsole/Brands'
import { TreeFn } from 'utils/tree-utils/types'

import { getExpandBrandsByType } from '../helpers/get-expand-brands-by-types'

import { useFilterTeams, UseFilterTeamsReturnType } from './use-filter-teams'

interface UseTeamsReturnType
  extends Omit<UseFilterTeamsReturnType, 'filterTeams'> {
  isError: boolean
  isLoading: boolean
  teams: TreeFn<IBrand>
  initialExpandedNodes: UUID[]
}

export function useTeams(): UseTeamsReturnType {
  const { data: teams, isLoading, isError, run } = useAsync<IBrand[]>()
  const { searchTerm, handleSearch, filterTeams }: UseFilterTeamsReturnType =
    useFilterTeams()

  useEffectOnce(() => {
    run(async () => {
      const teams = await getAvailableBrandsToSwitch()

      return teams
    })
  })

  const initialExpandedNodes = useMemo(() => {
    if (!teams) {
      return []
    }

    if (searchTerm) {
      // expand all type on brand type
      return getExpandBrandsByType(teams, [
        'Team',
        'Other',
        'Region',
        'Office',
        'Brokerage',
        'Personal'
      ])
    }

    return getExpandBrandsByType(teams)
  }, [teams, searchTerm])

  const getChildNodes = useCallback(
    parent => (parent ? parent.children || [] : teams || []),
    [teams]
  )

  return {
    isError,
    isLoading,
    searchTerm,
    handleSearch,
    teams: filterTeams(getChildNodes),
    initialExpandedNodes
  }
}
