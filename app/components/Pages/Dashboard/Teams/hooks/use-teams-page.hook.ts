import { useCallback, useEffect, useMemo, useState } from 'react'

import { getBrands } from 'models/BrandConsole/Brands'
import { getActiveTeamId } from 'utils/user-teams'

import { getUpdatedRootTeam } from '../helpers/get-updated-root-team'
import { updateUserRoles } from '../helpers/update-user-roles'

import { useAddEditTeamModal } from './use-add-edit-team-modal.hook'
import { useAddMembersModal } from './use-add-members-modal.hook'
import { useDeleteTeam } from './use-delete-team.hook'
import { useEditRolesModal } from './use-edit-roles-modal.hook'
import { useTeamsFilterHook } from './use-teams-filter.hook'

export function useTeamsPage(user: IUser, searchTerm: string) {
  const [rootTeam, setRootTeam] = useState<IBrand | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [updatingUserIds, setUpdatingUserIds] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)

    const activeTeamId = getActiveTeamId(user)

    if (activeTeamId) {
      getBrands(activeTeamId)
        .then(team => {
          setRootTeam(team.data)
          setLoading(false)
        })
        .catch(e => {
          setError(e)
          setLoading(false)
        })
    }
  }, [user])

  const updateRoles = async (
    team: IBrand,
    userId: string,
    newRoles: IBrandRole[]
  ) => {
    setUpdatingUserIds(updatingUserIds => [...updatingUserIds, userId])

    const updatedTeam = await updateUserRoles(team, userId, newRoles)

    if (rootTeam) {
      setRootTeam(getUpdatedRootTeam(rootTeam, team, updatedTeam))
    }

    setUpdatingUserIds(updatingUserIds =>
      updatingUserIds.filter(aUserId => aUserId !== userId)
    )
  }

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
    rootTeam,
    error,
    loading,
    updatingUserIds,
    updateRoles,
    getChildNodes: useTeamsFilterHook(getChildNodes, searchTerm),
    deleteTeam: useDeleteTeam(rootTeam, setRootTeam),
    addEditModal: useAddEditTeamModal(setRootTeam),
    editRolesModal: useEditRolesModal(setRootTeam),
    addMembersModal: useAddMembersModal(setRootTeam),
    initialExpandedNodes
  }
}
