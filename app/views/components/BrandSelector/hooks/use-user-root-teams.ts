import { useCallback, useMemo } from 'react'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import useAsync from '@app/hooks/use-async'
import { getBrands } from 'models/BrandConsole/Brands'
import { TreeFn } from 'utils/tree-utils/types'
import { getRootBrand } from 'utils/user-teams'

import { useFilterTeams, UseFilterTeamsReturnType } from './use-filter-teams'

interface UseUserRootTeamsReturnType
  extends Omit<UseFilterTeamsReturnType, 'filterTeams'> {
  isError: boolean
  isLoading: boolean
  rootTeam: Nullable<IBrand>
  initialExpandedNodes: UUID[]
  teams: TreeFn<IBrand>
}

export function useUserRootTeams(
  rootBrandId?: UUID,
  filterFn?: (team: IBrand) => boolean
): UseUserRootTeamsReturnType {
  const activeTeam = useUnsafeActiveTeam()
  const {
    data: rootTeam,
    isLoading,
    isError,
    run
  } = useAsync<Nullable<IBrand>>()
  const { searchTerm, handleSearch, filterTeams }: UseFilterTeamsReturnType =
    useFilterTeams(filterFn)

  useEffectOnce(() => {
    run(async () => {
      const userRootBrandId = rootBrandId ?? getRootBrand(activeTeam)?.id

      if (userRootBrandId) {
        const { data: brandTree } = await getBrands(userRootBrandId, true, [])

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
    searchTerm,
    handleSearch,
    initialExpandedNodes,
    teams: filterTeams(getChildNodes)
  }
}
