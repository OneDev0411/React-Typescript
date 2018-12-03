import { getBrandMembers } from 'actions/user/get-brand-members'
import { getActiveTeam } from 'utils/user-teams'

import store from '../../../stores'

export function getBrandAgents(user) {
  const activeTeam = getActiveTeam(user)

  if (activeTeam && activeTeam.brand.roles) {
    return activeTeam.brand.roles.reduce(
      (members, role) =>
        role.members ? members.concat(role.members) : members,
      []
    )
  }

  store.dispatch(getBrandMembers(activeTeam.brand.id))
}
