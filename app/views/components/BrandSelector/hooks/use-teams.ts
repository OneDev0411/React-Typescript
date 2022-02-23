import { useMemo, useCallback } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import useAsync from '@app/hooks/use-async'
import { getAvailableBrandsToSwitch } from 'models/BrandConsole/Brands'
import { TreeFn } from 'utils/tree-utils/types'

import { getExpandBrandsByType } from '../helpers/get-expand-brands-by-types'

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
    if (!teams) {
      return []
    }

    return getExpandBrandsByType(teams)
  }, [teams])

  return {
    isError,
    isLoading,
    teams: getChildNodes,
    initialExpandedNodes
  }
}
