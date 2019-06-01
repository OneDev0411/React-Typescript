import { Dispatch, useCallback, useState } from 'react'

import { ITeam } from 'models/BrandConsole/types'

import { updateRoles } from '../helpers/update-roles'
import { updateTeam } from '../helpers/update-team'

export function useEditRolesModal(
  setRootTeam: Dispatch<(prevState: ITeam) => ITeam>
) {
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null)

  const close = useCallback(() => setEditingTeam(null), [])

  const open = useCallback((team: ITeam) => setEditingTeam(team), [])

  const submit = useCallback(
    async (updates: ITeam) => {
      if (editingTeam && updates.roles) {
        const updatedTeam = await updateRoles(editingTeam, updates.roles)

        setRootTeam(rootTeam => {
          return rootTeam && updateTeam(rootTeam, editingTeam, updatedTeam)
        })
      }

      close()
    },
    [close, editingTeam, setRootTeam]
  )

  return {
    close,
    open,
    isOpen: editingTeam != null,
    submit,
    team: editingTeam
  }
}
