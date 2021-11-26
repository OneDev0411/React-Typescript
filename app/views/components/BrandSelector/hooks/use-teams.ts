import { useCallback } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import useAsync from '@app/hooks/use-async'
import { getAvailableBrandsToSwitch } from 'models/BrandConsole/Brands'
import { TreeFn } from 'utils/tree-utils/types'

interface UseTeamsReturnType {
  isError: boolean
  isLoading: boolean
  teams: TreeFn<IBrand>
  // initialExpandedNodes: UUID[]
  // teamNodes: TreeFn<IBrand[]>
}

export function useTeams(): UseTeamsReturnType {
  const { data: teams, isLoading, isError, run } = useAsync<IBrand[]>()

  useEffectOnce(() => {
    run(async () => {
      const teams = await getAvailableBrandsToSwitch()

      console.log({ teams })

      return teams
    })
  })

  const getChildNodes = useCallback(
    () => teams,
    [teams]
  )

  // const initialExpandedNodes = useMemo(() => {
  //   if (brands) {
  //     return [brands.id]
  //   }

  //   return []
  // }, [brands])

  return {
    isError,
    isLoading,
    teams: getChildNodes,
    // initialExpandedNodes,
    // teamNodes: getChildNodes
  }
}
