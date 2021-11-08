import { useCallback, useMemo } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useTeamsFilterHook } from '@app/components/Pages/Dashboard/Teams/hooks/use-teams-filter.hook'
import useAsync from '@app/hooks/use-async'
import { getBrands } from 'models/BrandConsole/Brands'
import { TreeFn } from 'utils/tree-utils/types'
import { getRootBrand } from 'utils/user-teams'

interface UseTeamReturnType {
  isError: boolean
  isLoading: boolean
  rootTeam: Nullable<IBrand>
  initialExpandedNodes: UUID[]
  teamNodes: TreeFn<IBrand>
}

export function useTeam(user: IUser, searchTerm: string): UseTeamReturnType {
  const {
    data: rootTeam,
    isLoading,
    isError,
    run
  } = useAsync<Nullable<IBrand>>()

  useEffectOnce(() => {
    run(async () => {
      const rootBrand = getRootBrand(user)

      if (rootBrand) {
        const { data: brandTree } = await getBrands(rootBrand.id, true, [])

        return brandTree
      }

      return null
    })
  })

  const getChildNodes = useCallback(
    parent => (parent ? parent.children || [] : rootTeam ? [rootTeam] : []),
    [rootTeam]
  )

  const initialExpandedNodes = useMemo(() => {
    if (rootTeam) {
      return searchTerm
        ? [rootTeam.id, ...(rootTeam.children || []).map(team => team.id)]
        : [rootTeam.id]
    }

    return []
  }, [rootTeam, searchTerm])

  return {
    isError,
    rootTeam,
    isLoading,
    initialExpandedNodes,
    teamNodes: useTeamsFilterHook(getChildNodes, searchTerm)
  }
}
