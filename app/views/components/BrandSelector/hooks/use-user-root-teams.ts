import { useCallback, useMemo } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import useAsync from '@app/hooks/use-async'
import { getBrands } from 'models/BrandConsole/Brands'
import { TreeFn } from 'utils/tree-utils/types'
import { getRootBrand } from 'utils/user-teams'

interface UseUserRootTeamsReturnType {
  isError: boolean
  isLoading: boolean
  rootTeam: Nullable<IBrand>
  initialExpandedNodes: UUID[]
  teams: TreeFn<IBrand>
}

export function useUserRootTeams(): UseUserRootTeamsReturnType {
  const activeTeam = useUnsafeActiveTeam()
  const {
    data: rootTeam,
    isLoading,
    isError,
    run
  } = useAsync<Nullable<IBrand>>()

  useEffectOnce(() => {
    run(async () => {
      const rootBrand = getRootBrand(activeTeam)

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
      return [rootTeam.id]
    }

    return []
  }, [rootTeam])

  return {
    isError,
    rootTeam,
    isLoading,
    initialExpandedNodes,
    teams: getChildNodes
  }
}
