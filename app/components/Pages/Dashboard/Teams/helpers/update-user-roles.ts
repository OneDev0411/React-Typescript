import Members from 'models/BrandConsole/Members'
import { getBrands } from 'models/BrandConsole/Brands'

import { getUserRoles } from './get-user-roles'

export async function updateUserRoles(
  team: ITeam,
  userId: string,
  newRoles: ITeamRole[]
): Promise<ITeam> {
  const roles = getUserRoles(team, userId)
  const rolesToRemove = roles.filter(
    role => !newRoles.find(newRole => newRole.id === role.id)
  )
  const rolesToAdd = newRoles.filter(
    role => !roles.find(aRole => aRole.id === role.id)
  )

  const removePromises = rolesToRemove.map(async role => {
    try {
      await Members.deleteMember(role, userId)
    } catch (e) {
      console.error(`Could not remove role ${role.id} from user ${userId}`, e)
    }
  })

  const addPromises = rolesToAdd.map(async role => {
    try {
      await Members.addMembers(role.brand, role.id, {
        users: [userId]
      })
    } catch (e) {
      console.error(`Could not add role ${role.id} to user ${userId}`, e)
    }
  })

  const allPromises = [...removePromises, ...addPromises]

  await Promise.all(allPromises)

  if (!allPromises.length) {
    return team
  }

  return {
    ...(await getBrands(team.id, false)).data,
    children: team.children
  }
}
