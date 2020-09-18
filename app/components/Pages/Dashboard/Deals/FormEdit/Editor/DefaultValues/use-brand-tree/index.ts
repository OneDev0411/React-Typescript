import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { getActiveTeamId } from 'utils/user-teams'
import { getBrands } from 'models/BrandConsole/Brands'

export function useBrandTree() {
  const user = useSelector<IAppState, IUser>(({ user }) => user)

  const [rootTeam, setRootTeam] = useState<IBrand | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getChildNodes = useCallback(
    parent => (parent ? parent.children || [] : rootTeam ? [rootTeam] : []),
    [rootTeam]
  )

  useEffect(() => {
    setIsLoading(true)

    const activeTeamId = getActiveTeamId(user)

    if (activeTeamId) {
      getBrands(activeTeamId)
        .then(team => {
          setRootTeam(team.data)
          setIsLoading(false)
        })
        .catch(e => {
          setIsLoading(false)
        })
    }
  }, [user])

  const initialExpandedNodes = useMemo(
    () =>
      rootTeam
        ? [rootTeam.id, ...(rootTeam.children || []).map(team => team.id)]
        : [],
    [rootTeam]
  )

  return {
    rootTeam,
    isLoading,
    getChildNodes,
    initialExpandedNodes
  }
}
