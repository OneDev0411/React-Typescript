import { useMemo, useCallback } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import useAsync from '@app/hooks/use-async'
import { getAvailableBrandsToSwitch } from 'models/BrandConsole/Brands'
import { TreeFn } from 'utils/tree-utils/types'

interface UseTeamsReturnType {
  isError: boolean
  isLoading: boolean
  teams: TreeFn<IBrand>
  initialExpandedNodes: UUID[]
}

export function useTeams(): UseTeamsReturnType {
  const { data: teams, isLoading, isError, run } = useAsync<IBrand[]>()

  useEffectOnce(() => {
    run(async () => {
      const teams = await getAvailableBrandsToSwitch()

      return teams
    })
  })

  const getChildNodes = useCallback(
    parent => (parent ? parent.children || [] : teams || []),
    [teams]
  )
  const initialExpandedNodes = useMemo(() => {
    let expandedNodes: UUID[] = []

    teams?.forEach(team => {
      if (team.children) {
        expandedNodes.push(team.id)
      }
    })

    return expandedNodes
  }, [teams])

  return {
    isError,
    isLoading,
    teams: getChildNodes,
    initialExpandedNodes
  }
}
