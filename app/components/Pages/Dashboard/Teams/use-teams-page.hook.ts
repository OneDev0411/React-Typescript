import { useCallback, useEffect, useMemo, useState } from 'react'

import { FormApi } from 'final-form'

import { ITeam, ITeamRole } from 'types/Team'
import { editBrand, getBrands } from 'models/BrandConsole/Brands'
import { getActiveTeamId } from 'utils/user-teams'

import { updateTree } from 'utils/tree-utils/update-tree'

import { updateUserRoles } from './helpers/update-user-roles'

export function useTeamsPage(user: IUser, searchTerm: string) {
  const [rootTeam, setRootTeam] = useState<ITeam | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [updatingUserIds, setUpdatingUserIds] = useState<string[]>([])
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null)

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

    updateTeam(team, newTeam)

    setUpdatingUserIds(updatingUserIds =>
      updatingUserIds.filter(aUserId => aUserId !== userId)
    )
  }

  const updateTeam = (team, newTeam, keepChildren = true) => {
    if (newTeam !== team) {
      setRootTeam(
        updateTree(
          rootTeam!,
          aTeam => aTeam === team,
          () => ({
            ...newTeam,
            children: keepChildren ? team.children : newTeam.children
          })
        )
      )
    }
  }
  const matches = useCallback(
    (team: ITeam) => {
      const regExp = new RegExp(searchTerm, 'gi')

      // performance improvement is possible by memoizing result of matches
      // because for deep nodes it's called so many times because of the
      // recursion
      return team.name.match(regExp) || (team.children || []).some(matches)
    },
    [searchTerm]
  )

  const getChildNodes = useCallback(
    (parent?: ITeam) => {
      const nodes = parent ? parent.children || [] : rootTeam ? [rootTeam] : []

      return searchTerm ? nodes.filter(matches) : nodes
    },
    [matches, rootTeam, searchTerm]
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
    editDialog: {
      open: (team: ITeam) => setEditingTeam(team),
      close: () => setEditingTeam(null),
      isOpen: !!editingTeam,
      submit: async (values: Partial<ITeam>, form: FormApi) => {
        if (editingTeam && values.id) {
          updateTeam(editingTeam, (await editBrand(values)).data)
          setEditingTeam(null)
        } else {
          //  TODO: new team
        }
      },
      validate: values => {
        const errors: { [key in keyof ITeam]?: string } = {}
        const { name } = values

        if (!name || name.length === 0) {
          errors.name = 'Name cannot be empty'
        }

        return errors
      },
      isSubmitting: false,
      team: editingTeam
    },
    initialExpandedNodes
  }
}
