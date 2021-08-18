import { useCallback, useEffect, useMemo, useState } from 'react'

import { useTeamsFilterHook } from '@app/components/Pages/Dashboard/Teams/hooks/use-teams-filter.hook'
import { getBrands } from 'models/BrandConsole/Brands'
import { getActiveTeamId } from 'utils/user-teams'

export function useTeam(user: IUser, searchTerm: string) {
  const [rootTeam, setRootTeam] = useState<Nullable<IBrand>>(null)
  const [error, setError] = useState<Nullable<Error>>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchBrands = async (brandId: UUID) => {
      setLoading(true)

      try {
        const { data: brandTree } = await getBrands(brandId)

        setRootTeam(brandTree)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError(err)
        setLoading(false)
      }
    }

    const activeTeamId = getActiveTeamId(user)

    if (activeTeamId) {
      fetchBrands(activeTeamId)
    }
  }, [user])

  const getChildNodes = useCallback(
    parent => (parent ? parent.children || [] : rootTeam ? [rootTeam] : []),
    [rootTeam]
  )

  const initialExpandedNodes = useMemo(
    () =>
      rootTeam
        ? [rootTeam.id, ...(rootTeam.children || []).map(team => team.id)]
        : [],
    [rootTeam]
  )

  return {
    error,
    loading,
    rootTeam,
    initialExpandedNodes,
    getChildNodes: useTeamsFilterHook(getChildNodes, searchTerm)
  }
}
