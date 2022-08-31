import { Dispatch, useCallback, useState } from 'react'

import { getBrands } from 'models/BrandConsole/Brands'
import Members from 'models/BrandConsole/Members'

import { getUpdatedRootTeam } from '../helpers/get-updated-root-team'

interface FormData {
  avatar?: File
  email: string
  firstName?: string
  lastName?: string
  phone: string
  roles: UUID[]
}

export function useAddMembersModal(
  setRootTeam: Dispatch<(prevState: IBrand) => IBrand>
) {
  const [team, setTeam] = useState<IBrand | null>(null)

  const close = useCallback(() => setTeam(null), [])

  const open = useCallback((team: IBrand) => setTeam(team), [])

  const submit = useCallback(
    // FIXME: fix types when they are added for MultipleContactSelect output
    async (values: FormData) => {
      if (!team) {
        return
      }

      const promises = values.roles.map(roleId =>
        Members.addMembers(team.id, roleId, values)
      )

      await Promise.all(promises)

      const newTeam = (await getBrands(team.id, false)).data

      setRootTeam(rootTeam => {
        return getUpdatedRootTeam(rootTeam, team, newTeam, true)
      })
      close()
    },
    [close, setRootTeam, team]
  )

  return {
    close,
    open,
    isOpen: team != null,
    submit,
    team
  }
}
