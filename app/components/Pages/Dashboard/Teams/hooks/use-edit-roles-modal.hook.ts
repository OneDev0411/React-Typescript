import { Dispatch, useCallback, useState } from 'react'

import { updateRoles } from '../helpers/update-roles'
import { getUpdatedRootTeam } from '../helpers/get-updated-root-team'

export function useEditRolesModal(
  setRootTeam: Dispatch<(prevState: ITeam) => ITeam>
) {
  const [team, setTeam] = useState<ITeam | null>(null)

  const close = useCallback(() => setTeam(null), [])

  const open = useCallback((team: ITeam) => setTeam(team), [])

  const submit = useCallback(
    async (updates: ITeam) => {
      if (team && updates.roles) {
        const updatedTeam = await updateRoles(team, updates.roles)

        setRootTeam(rootTeam => {
          return rootTeam && getUpdatedRootTeam(rootTeam, team, updatedTeam)
        })
      }

      close()
    },
    [close, setRootTeam, team]
  )

  return {
    close,
    open,
    isOpen: team !== null,
    submit,
    team
  }
}
