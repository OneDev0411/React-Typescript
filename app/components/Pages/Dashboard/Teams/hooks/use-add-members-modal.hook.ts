import { Dispatch, useCallback, useState } from 'react'

import Members from 'models/BrandConsole/Members'
import { getBrands } from 'models/BrandConsole/Brands'

import { getUpdatedRootTeam } from '../helpers/get-updated-root-team'

export function useAddMembersModal(
  setRootTeam: Dispatch<(prevState: IBrand) => IBrand>
) {
  const [team, setTeam] = useState<IBrand | null>(null)

  const close = useCallback(() => setTeam(null), [])

  const open = useCallback((team: IBrand) => setTeam(team), [])

  const submit = useCallback(
    // FIXME: fix types when they are added for MultipleContactSelect output
    async values => {
      if (!team) {
        return
      }

      // Currently we only use email but there are some cases when the contact
      // has multiple or no users related to it. These cases cannot be handled
      // with current MultipleContactSelect component as it's email-centered
      // and it needs more abstraction. So, for know we only use emails to add
      // new team members. In future we either add user selection feature to
      // MultipleContactSelect (like email selection that it already has)
      // or create a similar but separate component for selecting users or
      // emails (or phone numbers!)
      const emails = values.members
        .filter(item => item.email)
        .map(item => item.email)

      const promises = values.roles.map(roleId =>
        Members.addMembers(team.id, roleId, {
          emails
        })
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
