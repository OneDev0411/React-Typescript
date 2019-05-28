import { useCallback, useEffect, useMemo, useState } from 'react'

import { ITeam, ITeamRole } from 'types/Team'
import { getBrands } from 'models/BrandConsole/Brands'
import { getActiveTeamId } from 'utils/user-teams'

import { updateTree } from 'utils/tree-utils/update-tree'

import { updateUserRoles } from './helpers/update-user-roles'

export function useTeamsPage(user: IUser) {
  const [rootTeam, setRootTeam] = useState<ITeam | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [updatingUserIds, setUpdatingUserIds] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    getBrands(getActiveTeamId(user))
      .then(team => {
        setRootTeam(team.data)
        setLoading(false)
      })
      .catch(e => {
        setError(e)
        setLoading(false)
      })
  }, [user])

  const updateRoles = async (
    team: ITeam,
    userId: string,
    newRoles: ITeamRole[]
  ) => {
    setUpdatingUserIds(updatingUserIds => [...updatingUserIds, userId])

    const newTeam = await updateUserRoles(team, userId, newRoles)

    if (newTeam !== team) {
      setRootTeam(updateTree(rootTeam!, aTeam => aTeam === team, () => newTeam))
    }

    setUpdatingUserIds(updatingUserIds =>
      updatingUserIds.filter(aUserId => aUserId !== userId)
    )
  }

  const getChildNodes = useCallback(
    (parent?: ITeam) =>
      parent ? parent.children || [] : rootTeam ? [rootTeam] : [],
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
    rootTeam,
    error,
    loading,
    updatingUserIds,
    updateRoles,
    getChildNodes,
    initialExpandedNodes
  }
}
